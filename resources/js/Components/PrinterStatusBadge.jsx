import React from 'react';
import { Bluetooth, BluetoothOff, Loader2 } from 'lucide-react';

/**
 * PrinterStatusBadge
 * 
 * Small badge showing Bluetooth printer connection status.
 * Click to open printer settings / trigger connect.
 */
export default function PrinterStatusBadge({ isSupported, isConnected, status, printerName, onClick }) {
    if (!isSupported) {
        return null;
    }

    const getConfig = () => {
        switch (status) {
            case 'connected':
            case 'printing':
                return {
                    bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
                    text: 'text-emerald-700',
                    icon: <Bluetooth size={14} className="text-emerald-600" />,
                    label: printerName ? printerName.substring(0, 12) : 'Terhubung',
                    dot: 'bg-emerald-500',
                };
            case 'connecting':
                return {
                    bg: 'bg-amber-50 border-amber-200',
                    text: 'text-amber-700',
                    icon: <Loader2 size={14} className="text-amber-600 animate-spin" />,
                    label: 'Menghubungkan...',
                    dot: 'bg-amber-500',
                };
            case 'error':
                return {
                    bg: 'bg-red-50 border-red-200 hover:bg-red-100',
                    text: 'text-red-700',
                    icon: <BluetoothOff size={14} className="text-red-500" />,
                    label: 'Error',
                    dot: 'bg-red-500',
                };
            default:
                return {
                    bg: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
                    text: 'text-gray-600',
                    icon: <BluetoothOff size={14} className="text-gray-400" />,
                    label: 'Printer',
                    dot: 'bg-gray-400',
                };
        }
    };

    const config = getConfig();

    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${config.bg} ${config.text}`}
            title={isConnected ? `Printer: ${printerName}` : 'Hubungkan Printer Bluetooth'}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'printing' ? 'animate-pulse' : ''}`} />
            {config.icon}
            <span className="hidden sm:inline">{config.label}</span>
        </button>
    );
}
