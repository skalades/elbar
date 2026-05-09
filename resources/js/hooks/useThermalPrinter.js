/**
 * useThermalPrinter Hook
 * 
 * React hook for managing Bluetooth thermal printer connection
 * and printing ESC/POS receipts. Provides status, connect/disconnect,
 * and printReceipt functions with automatic fallback to window.print().
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import BluetoothPrinterService from '@/utils/bluetooth/BluetoothPrinterService';
import { buildElbarReceipt } from '@/utils/bluetooth/ReceiptBuilder';

/**
 * @typedef {'idle'|'connecting'|'connected'|'printing'|'error'} PrinterStatus
 */

/**
 * useThermalPrinter hook
 * 
 * @param {object} options
 * @param {string} [options.storeName]
 * @param {string} [options.storeAddress]
 * @param {string} [options.storePhone]
 * @param {string} [options.cashierName]
 * @param {number} [options.paperWidth]
 * @returns {object}
 */
export default function useThermalPrinter(options = {}) {
    const [status, setStatus] = useState('idle');
    const [printerName, setPrinterName] = useState(null);
    const [error, setError] = useState(null);
    const printerRef = useRef(null);

    const isSupported = BluetoothPrinterService.isSupported();

    // Get or create printer service instance
    useEffect(() => {
        if (!isSupported) return;

        const printer = BluetoothPrinterService.getInstance();
        printerRef.current = printer;

        // Sync initial state
        if (printer.isConnected) {
            setStatus('connected');
            setPrinterName(printer.deviceName);
        }

        // Subscribe to events
        const unsubs = [
            printer.on('connecting', () => {
                setStatus('connecting');
                setError(null);
            }),
            printer.on('connected', (data) => {
                setStatus('connected');
                setPrinterName(data?.deviceName || null);
                setError(null);
            }),
            printer.on('disconnected', () => {
                setStatus('idle');
                setPrinterName(null);
            }),
            printer.on('cancelled', () => {
                setStatus('idle');
            }),
            printer.on('printing', () => {
                setStatus('printing');
                setError(null);
            }),
            printer.on('printed', () => {
                setStatus('connected');
            }),
            printer.on('error', (data) => {
                setStatus('error');
                setError(data?.error || 'Terjadi kesalahan.');
            }),
        ];

        return () => unsubs.forEach(unsub => unsub());
    }, [isSupported]);

    /**
     * Connect to a Bluetooth printer (triggers browser picker)
     */
    const connect = useCallback(async () => {
        if (!printerRef.current) return;
        setError(null);
        const result = await printerRef.current.connect();
        if (result.error) {
            setError(result.error);
        }
    }, []);

    /**
     * Disconnect from the current printer
     */
    const disconnect = useCallback(() => {
        if (!printerRef.current) return;
        printerRef.current.disconnect();
        setError(null);
    }, []);

    /**
     * Print a receipt for the given order data.
     * Falls back to window.print() if Bluetooth is not connected.
     * 
     * @param {object} orderData - Order data (from flash.order)
     * @returns {Promise<{method: 'bluetooth'|'browser', success: boolean, error: string|null}>}
     */
    const printReceipt = useCallback(async (orderData) => {
        // If connected via Bluetooth, use ESC/POS
        if (printerRef.current?.isConnected) {
            try {
                const receiptData = buildElbarReceipt(orderData, {
                    storeName: options.storeName,
                    storeAddress: options.storeAddress,
                    storePhone: options.storePhone,
                    cashierName: options.cashierName,
                    paperWidth: options.paperWidth,
                });

                const result = await printerRef.current.print(receiptData);
                if (result.error) {
                    setError(result.error);
                    return { method: 'bluetooth', success: false, error: result.error };
                }
                return { method: 'bluetooth', success: true, error: null };
            } catch (err) {
                const errMsg = 'Gagal mencetak: ' + err.message;
                setError(errMsg);
                return { method: 'bluetooth', success: false, error: errMsg };
            }
        }

        // Fallback: browser print (window.print)
        try {
            window.print();
            return { method: 'browser', success: true, error: null };
        } catch (err) {
            return { method: 'browser', success: false, error: err.message };
        }
    }, [options]);

    /**
     * Clear the current error
     */
    const clearError = useCallback(() => {
        setError(null);
        if (status === 'error') {
            setStatus(printerRef.current?.isConnected ? 'connected' : 'idle');
        }
    }, [status]);

    return {
        /** Whether Web Bluetooth API is available */
        isSupported,
        /** Whether a printer is currently connected */
        isConnected: status === 'connected' || status === 'printing',
        /** Current printer status */
        status,
        /** Connected printer name */
        printerName,
        /** Last error message */
        error,
        /** Connect to a Bluetooth printer */
        connect,
        /** Disconnect from the printer */
        disconnect,
        /** Print a receipt (Bluetooth or fallback) */
        printReceipt,
        /** Clear error state */
        clearError,
    };
}
