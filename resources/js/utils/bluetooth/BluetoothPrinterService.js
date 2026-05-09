/**
 * BluetoothPrinterService
 * 
 * Manages Bluetooth Low Energy (BLE) connections to thermal printers.
 * Handles device discovery, GATT service/characteristic resolution,
 * chunked data writes (BLE MTU limit), and connection lifecycle events.
 * 
 * Usage:
 *   const printer = BluetoothPrinterService.getInstance();
 *   await printer.connect();
 *   await printer.print(escPosData);
 *   printer.disconnect();
 */

// Common Service UUIDs used by popular BLE thermal printers
const KNOWN_SERVICE_UUIDS = [
    '000018f0-0000-1000-8000-00805f9b34fb', // Generic thermal printer
    '0000ae30-0000-1000-8000-00805f9b34fb', // GOOJPRT / Milestone
    '0000ff00-0000-1000-8000-00805f9b34fb', // Many Chinese printers
    '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Microchip BLE UART
    'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Various generic printers
];

// Common Characteristic UUIDs for writing data
const KNOWN_CHARACTERISTIC_UUIDS = [
    '00002af1-0000-1000-8000-00805f9b34fb',
    '0000ae01-0000-1000-8000-00805f9b34fb',
    '0000ff02-0000-1000-8000-00805f9b34fb',
    '49535343-8841-43f4-a8d4-ecbe34729bb3',
    'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
];

// Default chunk size for BLE writes (conservative for compatibility)
const DEFAULT_CHUNK_SIZE = 100;

// Delay between chunks in ms (prevents buffer overflow on printer)
const CHUNK_DELAY_MS = 30;

class BluetoothPrinterService {
    static _instance = null;

    /**
     * Get singleton instance
     * @returns {BluetoothPrinterService}
     */
    static getInstance() {
        if (!BluetoothPrinterService._instance) {
            BluetoothPrinterService._instance = new BluetoothPrinterService();
        }
        return BluetoothPrinterService._instance;
    }

    constructor() {
        /** @type {BluetoothDevice|null} */
        this._device = null;

        /** @type {BluetoothRemoteGATTServer|null} */
        this._server = null;

        /** @type {BluetoothRemoteGATTCharacteristic|null} */
        this._characteristic = null;

        /** @type {string|null} */
        this._deviceName = null;

        /** @type {number} */
        this._chunkSize = DEFAULT_CHUNK_SIZE;

        /** @type {Map<string, Set<Function>>} */
        this._listeners = new Map();

        /** @type {boolean} */
        this._isConnecting = false;

        /** @type {boolean} */
        this._isPrinting = false;
    }

    // ─── Public API ──────────────────────────────────────────────

    /**
     * Check if Web Bluetooth API is available in this browser
     * @returns {boolean}
     */
    static isSupported() {
        return typeof navigator !== 'undefined' &&
            'bluetooth' in navigator &&
            typeof navigator.bluetooth.requestDevice === 'function';
    }

    /**
     * Get connected device name
     * @returns {string|null}
     */
    get deviceName() {
        return this._deviceName;
    }

    /**
     * Check if currently connected to a printer
     * @returns {boolean}
     */
    get isConnected() {
        return !!(this._device?.gatt?.connected && this._characteristic);
    }

    /**
     * Check if currently in the process of connecting
     * @returns {boolean}
     */
    get isConnecting() {
        return this._isConnecting;
    }

    /**
     * Check if currently printing
     * @returns {boolean}
     */
    get isPrinting() {
        return this._isPrinting;
    }

    /**
     * Connect to a Bluetooth thermal printer.
     * Opens the browser's Bluetooth device picker dialog.
     * Must be called from a user gesture (button click).
     * 
     * @returns {Promise<{success: boolean, deviceName: string|null, error: string|null}>}
     */
    async connect() {
        if (!BluetoothPrinterService.isSupported()) {
            return {
                success: false,
                deviceName: null,
                error: 'Web Bluetooth tidak didukung oleh browser ini. Gunakan Chrome atau Edge.'
            };
        }

        if (this.isConnected) {
            return {
                success: true,
                deviceName: this._deviceName,
                error: null
            };
        }

        if (this._isConnecting) {
            return {
                success: false,
                deviceName: null,
                error: 'Sedang menghubungkan ke printer...'
            };
        }

        this._isConnecting = true;
        this._emit('connecting');

        try {
            // Request device with known service filters
            // acceptAllDevices is used as fallback since not all printers
            // advertise standard services
            this._device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: KNOWN_SERVICE_UUIDS,
            });

            this._deviceName = this._device.name || 'Printer Tidak Dikenal';

            // Listen for disconnection
            this._device.addEventListener('gattserverdisconnected', () => {
                this._handleDisconnect();
            });

            // Connect to GATT server
            this._server = await this._device.gatt.connect();

            // Discover the writable characteristic
            this._characteristic = await this._discoverCharacteristic();

            if (!this._characteristic) {
                throw new Error(
                    'Tidak ditemukan characteristic yang bisa ditulis pada printer. ' +
                    'Pastikan printer mendukung Bluetooth Low Energy (BLE).'
                );
            }

            this._isConnecting = false;
            this._emit('connected', { deviceName: this._deviceName });

            return {
                success: true,
                deviceName: this._deviceName,
                error: null
            };
        } catch (error) {
            this._isConnecting = false;
            this._cleanup();

            // User cancelled the picker
            if (error.name === 'NotFoundError' || error.message?.includes('cancelled')) {
                this._emit('cancelled');
                return {
                    success: false,
                    deviceName: null,
                    error: null // Not an error — user cancelled
                };
            }

            const errorMsg = this._translateError(error);
            this._emit('error', { error: errorMsg });
            return {
                success: false,
                deviceName: null,
                error: errorMsg
            };
        }
    }

    /**
     * Disconnect from the current printer
     */
    disconnect() {
        if (this._device?.gatt?.connected) {
            this._device.gatt.disconnect();
        }
        this._cleanup();
        this._emit('disconnected');
    }

    /**
     * Send ESC/POS encoded data to the printer
     * 
     * @param {Uint8Array} data - ESC/POS encoded byte array
     * @returns {Promise<{success: boolean, error: string|null}>}
     */
    async print(data) {
        if (!this.isConnected) {
            return {
                success: false,
                error: 'Printer tidak terhubung. Hubungkan printer terlebih dahulu.'
            };
        }

        if (this._isPrinting) {
            return {
                success: false,
                error: 'Sedang mencetak. Tunggu hingga selesai.'
            };
        }

        this._isPrinting = true;
        this._emit('printing');

        try {
            await this._writeChunked(data);
            this._isPrinting = false;
            this._emit('printed');
            return { success: false, error: null };
        } catch (error) {
            this._isPrinting = false;
            const errorMsg = `Gagal mencetak: ${error.message}`;
            this._emit('error', { error: errorMsg });
            return { success: false, error: errorMsg };
        }
    }

    // ─── Event System ────────────────────────────────────────────

    /**
     * Register an event listener
     * Events: 'connecting', 'connected', 'disconnected', 'cancelled',
     *         'printing', 'printed', 'error'
     * 
     * @param {string} event 
     * @param {Function} callback 
     * @returns {Function} unsubscribe function
     */
    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => {
            this._listeners.get(event)?.delete(callback);
        };
    }

    // ─── Private Methods ─────────────────────────────────────────

    /**
     * Discover a writable characteristic by trying known UUIDs
     * @returns {Promise<BluetoothRemoteGATTCharacteristic|null>}
     */
    async _discoverCharacteristic() {
        // Strategy 1: Try known service UUIDs
        for (const serviceUUID of KNOWN_SERVICE_UUIDS) {
            try {
                const service = await this._server.getPrimaryService(serviceUUID);
                const characteristics = await service.getCharacteristics();

                for (const char of characteristics) {
                    if (
                        char.properties.write ||
                        char.properties.writeWithoutResponse
                    ) {
                        return char;
                    }
                }
            } catch {
                // Service not found on this printer, try next
                continue;
            }
        }

        // Strategy 2: Try all primary services and find any writable characteristic
        try {
            const services = await this._server.getPrimaryServices();
            for (const service of services) {
                try {
                    const characteristics = await service.getCharacteristics();
                    for (const char of characteristics) {
                        if (
                            char.properties.write ||
                            char.properties.writeWithoutResponse
                        ) {
                            return char;
                        }
                    }
                } catch {
                    continue;
                }
            }
        } catch {
            // getPrimaryServices() not supported or failed
        }

        return null;
    }

    /**
     * Write data to the characteristic in chunks to avoid BLE MTU overflow
     * @param {Uint8Array} data 
     */
    async _writeChunked(data) {
        const totalChunks = Math.ceil(data.length / this._chunkSize);

        for (let i = 0; i < totalChunks; i++) {
            const start = i * this._chunkSize;
            const end = Math.min(start + this._chunkSize, data.length);
            const chunk = data.slice(start, end);

            if (this._characteristic.properties.writeWithoutResponse) {
                await this._characteristic.writeValueWithoutResponse(chunk);
            } else {
                await this._characteristic.writeValueWithResponse(chunk);
            }

            // Small delay between chunks to prevent printer buffer overflow
            if (i < totalChunks - 1) {
                await this._delay(CHUNK_DELAY_MS);
            }
        }
    }

    /**
     * Handle unexpected disconnection
     */
    _handleDisconnect() {
        this._characteristic = null;
        this._server = null;
        this._isPrinting = false;
        this._isConnecting = false;
        this._emit('disconnected', { unexpected: true });
    }

    /**
     * Clean up all references
     */
    _cleanup() {
        this._device = null;
        this._server = null;
        this._characteristic = null;
        this._deviceName = null;
        this._isPrinting = false;
        this._isConnecting = false;
    }

    /**
     * Emit an event to all registered listeners
     * @param {string} event 
     * @param {*} data 
     */
    _emit(event, data = null) {
        this._listeners.get(event)?.forEach(cb => {
            try {
                cb(data);
            } catch (err) {
                console.error(`[BluetoothPrinter] Error in ${event} listener:`, err);
            }
        });
    }

    /**
     * Translate common Bluetooth errors to user-friendly Indonesian messages
     * @param {Error} error 
     * @returns {string}
     */
    _translateError(error) {
        const msg = error.message || '';

        if (msg.includes('User cancelled')) {
            return 'Pemilihan printer dibatalkan.';
        }
        if (msg.includes('Bluetooth adapter not available')) {
            return 'Bluetooth tidak tersedia di perangkat ini. Pastikan Bluetooth aktif.';
        }
        if (msg.includes('GATT Server is disconnected')) {
            return 'Koneksi ke printer terputus. Coba hubungkan kembali.';
        }
        if (msg.includes('NetworkError')) {
            return 'Gagal terhubung ke printer. Pastikan printer menyala dan dalam jangkauan.';
        }

        return `Kesalahan Bluetooth: ${msg}`;
    }

    /**
     * Promise-based delay
     * @param {number} ms 
     * @returns {Promise<void>}
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default BluetoothPrinterService;
