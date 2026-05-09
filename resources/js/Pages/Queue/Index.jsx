import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import { Clock, Play, CheckCircle, XCircle } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';

export default function QueueIndex({ queues, employees }) {
    
    const updateStatus = (orderId, newStatus) => {
        router.post(route('queue.update-status', orderId), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const assignEmployee = (orderId, employeeId) => {
        if (!employeeId) return;
        router.post(route('pos.assign-employee', orderId), { employee_ids: [employeeId] }, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'menunggu': return <Badge type="warning">Menunggu</Badge>;
            case 'dicuci': return <Badge type="info">Dicuci</Badge>;
            case 'selesai': return <Badge type="success">Selesai</Badge>;
            case 'dibatalkan': return <Badge type="danger">Batal</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Antrian</h2>
                    <a href={route('queue.monitor')} target="_blank" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                        <Play size={16} /> Buka Layar Monitor TV
                    </a>
                </div>
            }
        >
            <Head title="Manajemen Antrian" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {queues.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <Clock size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-lg">Belum ada antrian hari ini.</p>
                            </div>
                        ) : (
                            queues.map(queue => (
                                <Card key={queue.id} className={queue.status === 'selesai' ? 'opacity-60 grayscale-[0.3]' : ''}>
                                    <Card.Body>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-widest text-gray-900">
                                                    {queue.vehicle?.plate_number}
                                                </h3>
                                                <p className="text-sm text-gray-500">{queue.order_number}</p>
                                            </div>
                                            {getStatusBadge(queue.status)}
                                        </div>
                                        
                                        <div className="text-sm text-gray-600 mb-2">
                                            Masuk: {new Date(queue.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>

                                        {/* Employee Assignment */}
                                        <div className="mb-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Teknisi</label>
                                            <select 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                onChange={(e) => assignEmployee(queue.id, e.target.value)}
                                                value={queue.employees && queue.employees.length > 0 ? queue.employees[0].id : ''}
                                            >
                                                <option value="">Pilih Teknisi</option>
                                                {employees && employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.user?.name || 'No Name'}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Action Buttons */}
                                        {queue.status !== 'selesai' && queue.status !== 'dibatalkan' && (
                                            <div className="flex gap-2">
                                                {queue.status === 'menunggu' && (
                                                    <button 
                                                        onClick={() => updateStatus(queue.id, 'dicuci')}
                                                        className="flex-1 bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-200 transition-colors"
                                                    >
                                                        <Play size={16} /> Mulai Cuci
                                                    </button>
                                                )}
                                                
                                                {queue.status === 'dicuci' && (
                                                    <button 
                                                        onClick={() => updateStatus(queue.id, 'selesai')}
                                                        className="flex-1 bg-green-100 text-green-700 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-200 transition-colors"
                                                    >
                                                        <CheckCircle size={16} /> Selesai
                                                    </button>
                                                )}

                                                <button 
                                                    onClick={() => updateStatus(queue.id, 'dibatalkan')}
                                                    className="w-10 bg-red-50 text-red-600 flex items-center justify-center rounded-lg hover:bg-red-100 transition-colors"
                                                    title="Batalkan"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
