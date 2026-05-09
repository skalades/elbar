import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import BottomSheetModal from '@/Components/BottomSheetModal';
import { Ticket, Plus, Edit2, Trash2, Calendar, Users } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';

export default function VoucherIndex({ vouchers }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        type: 'percent',
        value: '',
        max_uses: '',
        expired_at: '',
    });

    const openModal = (voucher = null) => {
        if (voucher) {
            setEditData(voucher);
            setData({
                code: voucher.code,
                type: voucher.type,
                value: voucher.value,
                max_uses: voucher.max_uses,
                expired_at: voucher.expired_at ? voucher.expired_at.split('T')[0] : '',
            });
        } else {
            setEditData(null);
            reset();
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editData) {
            put(route('vouchers.update', editData.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('vouchers.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus voucher ini?')) {
            router.delete(route('vouchers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Voucher / Diskon</h2>}
        >
            <Head title="Voucher" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Daftar Voucher</h3>
                            <p className="text-sm text-gray-500">Kelola kode promo dan diskon</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                        >
                            <Plus size={18} /> Tambah Voucher
                        </button>
                    </div>

                    {/* Voucher Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vouchers.map((voucher) => {
                            const isExpired = voucher.expired_at && new Date(voucher.expired_at) < new Date();
                            const isLimitReached = voucher.max_uses > 0 && voucher.current_uses >= voucher.max_uses;
                            const isActive = !isExpired && !isLimitReached;

                            return (
                                <Card 
                                    key={voucher.id} 
                                    className={`overflow-hidden hover:shadow-md transition-shadow border-2 ${isActive ? 'border-transparent' : 'border-gray-200 opacity-75'}`}
                                >
                                    <Card.Body className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Ticket size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 text-xl tracking-wider">{voucher.code}</h4>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {isActive ? 'Aktif' : isExpired ? 'Kedaluwarsa' : 'Limit Habis'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-indigo-600">
                                                    {voucher.type === 'percent' ? `${voucher.value}%` : formatRupiah(voucher.value)}
                                                </span>
                                                <p className="text-xs text-gray-500">Potongan</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 border-t border-gray-100 pt-4 mt-4 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 flex items-center gap-1">
                                                    <Users size={14} /> Penggunaan
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {voucher.current_uses} / {voucher.max_uses == 0 ? '∞' : voucher.max_uses}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 flex items-center gap-1">
                                                    <Calendar size={14} /> Berlaku S/D
                                                </span>
                                                <span className="font-semibold text-gray-700">
                                                    {voucher.expired_at ? new Date(voucher.expired_at).toLocaleDateString('id-ID') : 'Selamanya'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
                                            <button
                                                onClick={() => openModal(voucher)}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(voucher.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })}

                        {vouchers.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Belum ada data voucher.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Add/Edit Voucher */}
            <BottomSheetModal
                isOpen={isOpen}
                onClose={closeModal}
                title={editData ? 'Edit Voucher' : 'Tambah Voucher'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Voucher</label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            placeholder="CONTOH: HEMAT50"
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-bold uppercase tracking-wider"
                            required
                        />
                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Potongan</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setData('type', 'percent')}
                                className={`py-2.5 px-4 rounded-lg font-bold transition-colors border ${data.type === 'percent' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                Persentase (%)
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('type', 'fixed')}
                                className={`py-2.5 px-4 rounded-lg font-bold transition-colors border ${data.type === 'fixed' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                Nominal Tetap (Rp)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {data.type === 'percent' ? 'Persentase Diskon (%)' : 'Nominal Diskon (Rp)'}
                        </label>
                        <input
                            type="number"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Penggunaan (0 untuk tanpa batas)</label>
                        <input
                            type="number"
                            value={data.max_uses}
                            onChange={(e) => setData('max_uses', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.max_uses && <p className="text-red-500 text-xs mt-1">{errors.max_uses}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kedaluwarsa (Opsional)</label>
                        <input
                            type="date"
                            value={data.expired_at}
                            onChange={(e) => setData('expired_at', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.expired_at && <p className="text-red-500 text-xs mt-1">{errors.expired_at}</p>}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : editData ? 'Simpan Perubahan' : 'Tambah Voucher'}
                        </button>
                    </div>
                </form>
            </BottomSheetModal>
        </AuthenticatedLayout>
    );
}
