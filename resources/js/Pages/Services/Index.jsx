import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import { Plus, Edit2, Trash2, Car } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';

export default function ServiceIndex({ services, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        service_category_id: categories.length > 0 ? categories[0].id : '',
        name: '',
        price: '',
        vehicle_size: '',
    });

    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        if (categories.length > 0) setData('service_category_id', categories[0].id);
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setIsEditing(true);
        setData({
            id: service.id,
            service_category_id: service.service_category_id,
            name: service.name,
            price: service.price,
            vehicle_size: service.vehicle_size || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('services.update', data.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('services.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus layanan ini?')) {
            destroy(route('services.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Layanan</h2>}
        >
            <Head title="Manajemen Layanan" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-end">
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus size={18} /> Tambah Layanan
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {services.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-lg">Belum ada layanan terdaftar.</p>
                            </div>
                        ) : (
                            services.map(service => (
                                <Card key={service.id}>
                                    <Card.Body className="p-5 flex flex-col items-center justify-center text-center">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                                            <Car size={28} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">{service.name}</h4>
                                        <p className="text-sm font-medium text-gray-500 mb-2">{service.category?.name}</p>
                                        <p className="text-lg text-indigo-600 font-bold mb-4">{formatRupiah(service.price)}</p>
                                        
                                        {service.vehicle_size && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mb-4">
                                                Ukuran: {service.vehicle_size}
                                            </span>
                                        )}

                                        <div className="flex gap-2 w-full mt-auto">
                                            <button 
                                                onClick={() => openEditModal(service)}
                                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                                            >
                                                <Edit2 size={16} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(service.id)}
                                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                                            >
                                                <Trash2 size={16} /> Hapus
                                            </button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 p-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b p-4 sm:p-5">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {isEditing ? 'Edit Layanan' : 'Tambah Layanan'}
                            </h3>
                            <button
                                onClick={closeModal}
                                type="button"
                                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 sm:p-5">
                            <div className="grid gap-4 mb-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Nama Layanan</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-600 focus:ring-indigo-600"
                                        placeholder="Contoh: Cuci Salju"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Kategori</label>
                                    <select
                                        value={data.service_category_id}
                                        onChange={e => setData('service_category_id', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.service_category_id && <p className="mt-1 text-sm text-red-600">{errors.service_category_id}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-600 focus:ring-indigo-600"
                                        placeholder="50000"
                                        required
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Ukuran Kendaraan (Opsional)</label>
                                    <select
                                        value={data.vehicle_size}
                                        onChange={e => setData('vehicle_size', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">-- Semua Ukuran --</option>
                                        <option value="Kecil">Kecil</option>
                                        <option value="Sedang">Sedang</option>
                                        <option value="Besar">Besar</option>
                                        <option value="Lux/XL">Lux/XL</option>
                                    </select>
                                    {errors.vehicle_size && <p className="mt-1 text-sm text-red-600">{errors.vehicle_size}</p>}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Layanan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
