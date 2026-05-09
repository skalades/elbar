import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import BottomSheetModal from '@/Components/BottomSheetModal';
import { Settings, Plus, Edit2, Trash2, Beaker } from 'lucide-react';

export default function RecipesIndex({ usages, services, products }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        service_id: '',
        product_id: '',
        qty_used: '',
    });

    const openModal = (usage = null) => {
        if (usage) {
            setEditData(usage);
            setData({
                service_id: usage.service_id,
                product_id: usage.product_id,
                qty_used: usage.qty_used,
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
            put(route('inventory.recipes.update', editData.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('inventory.recipes.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus formula ini?')) {
            router.delete(route('inventory.recipes.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pengaturan Formula (Resep)</h2>}
        >
            <Head title="Formula Stok" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Formula Pemakaian Bahan</h3>
                            <p className="text-sm text-gray-500">Atur berapa banyak bahan yang digunakan per layanan</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                        >
                            <Plus size={18} /> Tambah Formula
                        </button>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Layanan</th>
                                        <th className="px-6 py-3">Bahan Baku</th>
                                        <th className="px-6 py-3">Takaran / Jumlah</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usages.map((usage) => (
                                        <tr key={usage.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {usage.service?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Beaker size={16} className="text-indigo-500" />
                                                    <span>{usage.product?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {usage.qty_used} {usage.product?.unit}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(usage)}
                                                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(usage.id)}
                                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {usages.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                                                Belum ada formula yang diatur.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Add/Edit Formula */}
            <BottomSheetModal
                isOpen={isOpen}
                onClose={closeModal}
                title={editData ? 'Edit Formula' : 'Tambah Formula'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Layanan</label>
                        <select
                            value={data.service_id}
                            onChange={(e) => setData('service_id', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            disabled={!!editData}
                        >
                            <option value="">Pilih Layanan</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                        {errors.service_id && <p className="text-red-500 text-xs mt-1">{errors.service_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bahan Baku</label>
                        <select
                            value={data.product_id}
                            onChange={(e) => setData('product_id', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            disabled={!!editData}
                        >
                            <option value="">Pilih Produk</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name} ({product.unit})</option>
                            ))}
                        </select>
                        {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pemakaian</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.qty_used}
                            onChange={(e) => setData('qty_used', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.qty_used && <p className="text-red-500 text-xs mt-1">{errors.qty_used}</p>}
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
                            {processing ? 'Memproses...' : editData ? 'Simpan Perubahan' : 'Tambah Formula'}
                        </button>
                    </div>
                </form>
            </BottomSheetModal>
        </AuthenticatedLayout>
    );
}
