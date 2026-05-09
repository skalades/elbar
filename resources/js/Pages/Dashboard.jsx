import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import { formatRupiah } from '@/utils/currency';
import { TrendingUp, Car, Receipt, ArrowRight, Users, Box, Ticket, Wrench, Award } from 'lucide-react';

export default function Dashboard({ summary, histori_order }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isOwner = user.role === 'Owner' || (user.roles && user.roles.some(r => r.name === 'Owner' || r.name === 'Superadmin'));
    
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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard Utama</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
                            <Card.Body className="flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 font-medium mb-1">Omzet Hari Ini</p>
                                    <h3 className="text-3xl font-bold">{formatRupiah(summary?.omzet_hari_ini || 0)}</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <TrendingUp size={28} className="text-white" />
                                </div>
                            </Card.Body>
                        </Card>
                        
                        <Card>
                            <Card.Body className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium mb-1">Mobil Masuk (Hari Ini)</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{summary?.mobil_masuk || 0}</h3>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <Car size={28} className="text-indigo-600" />
                                </div>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium mb-1">Rata-rata Transaksi</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{formatRupiah(summary?.rata_rata_transaksi || 0)}</h3>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <Receipt size={28} className="text-emerald-600" />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Menu Navigasi (Grid of Cards) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Menu Navigasi</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                            {/* Kasir */}
                            <Card className="hover:ring-2 ring-indigo-500 transition-all group">
                                <Link href={route('pos.index')} className="block p-4 text-center">
                                    <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-2">
                                        <Receipt size={24} />
                                    </div>
                                    <h4 className="font-bold text-gray-900">Kasir</h4>
                                </Link>
                            </Card>
                            
                            {/* Antrian */}
                            <Card className="hover:ring-2 ring-indigo-500 transition-all group">
                                <Link href={route('queue.index')} className="block p-4 text-center">
                                    <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                                        <Car size={24} />
                                    </div>
                                    <h4 className="font-bold text-gray-900">Antrian</h4>
                                </Link>
                            </Card>

                            {/* Layanan */}
                            {isOwner && (
                                <Card className="hover:ring-2 ring-indigo-500 transition-all group">
                                    <Link href={route('services.index')} className="block p-4 text-center">
                                        <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-2">
                                            <Wrench size={24} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Layanan</h4>
                                    </Link>
                                </Card>
                            )}

                            {/* Karyawan */}
                            {isOwner && (
                                <Card className="hover:ring-2 ring-indigo-500 transition-all group">
                                    <Link href={route('employees.index')} className="block p-4 text-center">
                                        <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-2">
                                            <Users size={24} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Karyawan</h4>
                                    </Link>
                                </Card>
                            )}

                            {/* Inventori */}
                            {isOwner && (
                                <Card className="hover:ring-2 ring-indigo-500 transition-all group">
                                    <Link href={route('inventory.index')} className="block p-4 text-center">
                                        <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-2">
                                            <Box size={24} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Inventori</h4>
                                    </Link>
                                </Card>
                            )}

                            {/* Voucher */}
                            {isOwner && (
                                <Card className="hover:ring-2 ring-indigo-500 transition-all group">
                                    <Link href={route('vouchers.index')} className="block p-4 text-center">
                                        <div className="mx-auto w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-2">
                                            <Ticket size={24} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Voucher</h4>
                                    </Link>
                                </Card>
                            )}

                            {/* Membership */}
                            {isOwner && (
                                <Card className="hover:ring-2 ring-indigo-500 transition-all group">
                                    <Link href={route('membership.index')} className="block p-4 text-center">
                                        <div className="mx-auto w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-2">
                                            <Award size={24} />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Membership</h4>
                                    </Link>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Histori Order */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">Histori Order Terbaru</h3>
                        </div>
                        
                        <Card>
                            <div className="divide-y divide-gray-100">
                                {!histori_order || histori_order.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">Belum ada transaksi</div>
                                ) : (
                                    histori_order.map(order => (
                                        <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                                                    <Car size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 uppercase tracking-wider">{order.vehicle?.plate_number}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <span>{order.order_number}</span>
                                                        <span>•</span>
                                                        <span>{new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900 mb-1">{formatRupiah(order.total)}</div>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
