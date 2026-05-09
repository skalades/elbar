import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Clock } from 'lucide-react';

export default function TVMonitor({ activeQueues }) {
    
    // Auto refresh every 10 seconds for the TV Monitor
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['activeQueues'], preserveState: true, preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const Column = ({ title, bgClass, headerClass, items }) => (
        <div className={`flex flex-col h-full rounded-3xl overflow-hidden ${bgClass}`}>
            <div className={`py-6 text-center shadow-sm z-10 ${headerClass}`}>
                <h2 className="text-3xl font-bold text-white uppercase tracking-wider">{title}</h2>
                <div className="text-white/80 font-medium text-lg mt-1">{items?.length || 0} Mobil</div>
            </div>
            <div className="flex-1 p-6 overflow-y-hidden">
                <div className="space-y-4">
                    {(!items || items.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/40 pt-20">
                            <Clock size={64} className="mb-4" />
                            <p className="text-2xl font-medium">Kosong</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <Card key={item.id} className="border-0 shadow-md transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                                <Card.Body className="py-5 flex items-center justify-center">
                                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-[0.2em]">
                                        {item.vehicle?.plate_number}
                                    </h3>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-6 flex flex-col font-sans">
            <Head title="Monitor Antrian" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8 px-4">
                <div className="flex items-center gap-4">
                    <ApplicationLogo className="w-16 h-16 text-white fill-current" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">ELBAR CAR WASH</h1>
                        <p className="text-gray-400 text-lg">Monitor Antrian Real-time</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-white tracking-widest">
                        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-gray-400 text-lg font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Columns */}
            <div className="flex-1 grid grid-cols-3 gap-8">
                <Column 
                    title="Menunggu" 
                    bgClass="bg-gray-800/50 border border-gray-700/50" 
                    headerClass="bg-yellow-500" 
                    items={activeQueues.menunggu} 
                />
                <Column 
                    title="Sedang Dicuci" 
                    bgClass="bg-gray-800/50 border border-gray-700/50" 
                    headerClass="bg-blue-500" 
                    items={activeQueues.dicuci} 
                />
                <Column 
                    title="Selesai (Siap)" 
                    bgClass="bg-gray-800/50 border border-gray-700/50" 
                    headerClass="bg-green-500" 
                    items={activeQueues.selesai} 
                />
            </div>
        </div>
    );
}
