import React from 'react';
import BottomSheetModal from '@/Components/BottomSheetModal';
import { Bluetooth, BluetoothOff, Unplug, Printer, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * PrinterSettings
 * 
 * Bottom sheet modal for managing Bluetooth printer connection.
 * Shows connection status, allows connect/disconnect, and provides
 * fallback information when Bluetooth is not supported.
 */
export default function PrinterSettings({
    isOpen,
    onClose,
    isSupported,
    isConnected,
    status,
    printerName,
    error,
    onConnect,
    onDisconnect,
    onClearError,
}) {
    return (
        <BottomSheetModal isOpen={isOpen} onClose={onClose} title="Pengaturan Printer">
            <div className="space-y-5 pb-4">
                {/* Status Card */}
                <div className={`rounded-2xl p-5 border ${
                    isConnected
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                            isConnected ? 'bg-emerald-100' : 'bg-gray-100'
                        }`}>
                            {isConnected ? (
                                <Bluetooth size={28} className="text-emerald-600" />
                            ) : (
                                <BluetoothOff size={28} className="text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${isConnected ? 'text-emerald-800' : 'text-gray-700'}`}>
                                {isConnected ? 'Printer Terhubung' : 'Tidak Terhubung'}
                            </p>
                            {isConnected && printerName && (
                                <p className="text-xs text-emerald-600 truncate mt-0.5">
                                    <Printer size={12} className="inline mr-1" />
                                    {printerName}
                                </p>
                            )}
                            {!isConnected && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Belum ada printer yang terhubung
                                </p>
                            )}
                            {status === 'printing' && (
                                <p className="text-xs text-emerald-600 mt-0.5 animate-pulse font-medium">
                                    Sedang mencetak...
                                </p>
                            )}
                        </div>
                        {isConnected && (
                            <div className="flex-shrink-0">
                                <CheckCircle size={24} className="text-emerald-500" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-red-700 font-medium">Kesalahan</p>
                                <p className="text-xs text-red-600 mt-1">{error}</p>
                            </div>
                            <button
                                onClick={onClearError}
                                className="text-red-400 hover:text-red-600 text-xs font-medium"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {isSupported ? (
                    <div className="space-y-3">
                        {!isConnected ? (
                            <button
                                onClick={onConnect}
                                disabled={status === 'connecting'}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'connecting' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Menghubungkan...
                                    </>
                                ) : (
                                    <>
                                        <Bluetooth size={18} />
                                        Hubungkan Printer Bluetooth
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={onDisconnect}
                                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Unplug size={18} />
                                Putuskan Koneksi
                            </button>
                        )}
                    </div>
                ) : (
                    /* Browser Not Supported */
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <div className="flex items-start gap-3">
                            <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-amber-800 font-bold">Bluetooth Tidak Didukung</p>
                                <p className="text-xs text-amber-700 mt-1.5 leading-relaxed">
                                    Browser ini tidak mendukung Web Bluetooth. 
                                    Gunakan <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong> untuk 
                                    menghubungkan printer Bluetooth.
                                </p>
                                <p className="text-xs text-amber-600 mt-2">
                                    Anda tetap bisa mencetak menggunakan dialog cetak browser (window.print).
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>Tips:</strong> Pastikan printer thermal dalam keadaan menyala dan mode Bluetooth aktif. 
                        Saat diminta, pilih nama printer Anda dari daftar perangkat yang muncul. 
                        Printer harus mendukung <strong>Bluetooth Low Energy (BLE)</strong>.
                    </p>
                </div>
            </div>
        </BottomSheetModal>
    );
}
