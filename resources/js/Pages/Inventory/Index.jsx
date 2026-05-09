import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import BottomSheetModal from '@/Components/BottomSheetModal';
import { Package, Plus, Edit2, Trash2, ArrowUpDown, AlertTriangle } from 'lucide-react';

export default function InventoryIndex({ products, mutations }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMutateOpen, setIsMutateOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        unit: '',
        current_stock: '',
        min_stock: '',
    });

    const mutationForm = useForm({
        type: 'in',
        qty: '',
        notes: '',
    });

    const openModal = (product = null) => {
        if (product) {
            setEditData(product);
            setData({
                name: product.name,
                unit: product.unit,
                current_stock: product.current_stock,
                min_stock: product.min_stock,
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

    const openMutateModal = (product) => {
        setSelectedProduct(product);
        mutationForm.reset();
        setIsMutateOpen(true);
    };

    const closeMutateModal = () => {
        setIsMutateOpen(false);
        mutationForm.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editData) {
            put(route('inventory.update', editData.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('inventory.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleMutateSubmit = (e) => {
        e.preventDefault();
        mutationForm.post(route('inventory.mutate', selectedProduct.id), {
            onSuccess: () => closeMutateModal(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(route('inventory.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Stok (Inventori)</h2>}
        >
            <Head title="Inventori" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Stok Bahan Baku</h3>
                            <p className="text-sm text-gray-500">Pantau dan kelola stok bahan</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                        >
                            <Plus size={18} /> Tambah Produk
                        </button>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {products.map((product) => {
                            const isLowStock = Number(product.current_stock) <= Number(product.min_stock);
                            return (
                                <Card 
                                    key={product.id} 
                                    className={`overflow-hidden hover:shadow-md transition-shadow border-2 ${isLowStock ? 'border-red-200' : 'border-transparent'}`}
                                >
                                    <Card.Body className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-full ${isLowStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{product.name}</h4>
                                                    <span className="text-sm text-gray-500">Satuan: {product.unit}</span>
                                                </div>
                                            </div>
                                            {isLowStock && (
                                                <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                                    <AlertTriangle size={12} /> Stok Tipis
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2 border-t border-gray-100 pt-4 mt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-sm">Stok Sekarang</span>
                                                <span className={`text-lg font-black ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {product.current_stock} {product.unit}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Batas Minimum</span>
                                                <span className="font-semibold text-gray-700">{product.min_stock} {product.unit}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between gap-2 mt-6 pt-4 border-t border-gray-50">
                                            <button
                                                onClick={() => openMutateModal(product)}
                                                className="inline-flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                            >
                                                <ArrowUpDown size={14} /> Mutasi
                                            </button>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })}

                        {products.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Belum ada data produk.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Mutations Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900">Riwayat Mutasi Stok</h3>
                            <p className="text-sm text-gray-500">50 mutasi terakhir</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Produk</th>
                                        <th className="px-6 py-3">Tipe</th>
                                        <th className="px-6 py-3">Jumlah</th>
                                        <th className="px-6 py-3">Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mutations.map((mutation) => (
                                        <tr key={mutation.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                {new Date(mutation.mutation_date).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {mutation.product?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${mutation.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {mutation.type === 'in' ? 'Masuk' : 'Keluar'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {mutation.type === 'in' ? '+' : '-'}{mutation.qty}
                                            </td>
                                            <td className="px-6 py-4">{mutation.notes}</td>
                                        </tr>
                                    ))}
                                    {mutations.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                                                Belum ada riwayat mutasi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Add/Edit Product */}
            <BottomSheetModal
                isOpen={isOpen}
                onClose={closeModal}
                title={editData ? 'Edit Produk' : 'Tambah Produk'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                        <input
                            type="text"
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                            placeholder="Contoh: Liter, Pcs, ml"
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok Sekarang</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.current_stock}
                            onChange={(e) => setData('current_stock', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.current_stock && <p className="text-red-500 text-xs mt-1">{errors.current_stock}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batas Minimum Stok</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.min_stock}
                            onChange={(e) => setData('min_stock', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.min_stock && <p className="text-red-500 text-xs mt-1">{errors.min_stock}</p>}
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
                            {processing ? 'Memproses...' : editData ? 'Simpan Perubahan' : 'Tambah Produk'}
                        </button>
                    </div>
                </form>
            </BottomSheetModal>

            {/* Modal Mutate Stock */}
            <BottomSheetModal
                isOpen={isMutateOpen}
                onClose={closeMutateModal}
                title={`Mutasi Stok: ${selectedProduct?.name}`}
            >
                <form onSubmit={handleMutateSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Mutasi</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => mutationForm.setData('type', 'in')}
                                className={`py-2.5 px-4 rounded-lg font-bold transition-colors border ${mutationForm.data.type === 'in' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                Masuk (+)
                            </button>
                            <button
                                type="button"
                                onClick={() => mutationForm.setData('type', 'out')}
                                className={`py-2.5 px-4 rounded-lg font-bold transition-colors border ${mutationForm.data.type === 'out' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                Keluar (-)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah ({selectedProduct?.unit})</label>
                        <input
                            type="number"
                            step="0.01"
                            value={mutationForm.data.qty}
                            onChange={(e) => mutationForm.setData('qty', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {mutationForm.errors.qty && <p className="text-red-500 text-xs mt-1">{mutationForm.errors.qty}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                        <input
                            type="text"
                            value={mutationForm.data.notes}
                            onChange={(e) => mutationForm.setData('notes', e.target.value)}
                            placeholder="Contoh: Kulakan, Rusak, dll"
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {mutationForm.errors.notes && <p className="text-red-500 text-xs mt-1">{mutationForm.errors.notes}</p>}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                        <button
                            type="button"
                            onClick={closeMutateModal}
                            className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={mutationForm.processing}
                            className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50"
                        >
                            {mutationForm.processing ? 'Memproses...' : 'Simpan Mutasi'}
                        </button>
                    </div>
                </form>
            </BottomSheetModal>
        </AuthenticatedLayout>
    );
}
