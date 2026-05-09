import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import BottomSheetModal from '@/Components/BottomSheetModal';
import { User, Plus, Edit2, Trash2, Briefcase, DollarSign, Percent } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';

export default function EmployeeIndex({ employees }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        position: '',
        base_salary: '',
        commission_rate: '',
    });

    const openModal = (employee = null) => {
        if (employee) {
            setEditData(employee);
            setData({
                name: employee.user.name,
                email: employee.user.email,
                password: '', // Jangan tampilkan password lama
                position: employee.position,
                base_salary: employee.base_salary,
                commission_rate: employee.commission_rate,
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
            put(route('employees.update', editData.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('employees.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
            router.delete(route('employees.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Karyawan</h2>}
        >
            <Head title="Karyawan" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Daftar Karyawan</h3>
                            <p className="text-sm text-gray-500">Kelola data karyawan dan komisi</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                        >
                            <Plus size={18} /> Tambah Karyawan
                        </button>
                    </div>

                    {/* Employee Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((employee) => (
                            <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <Card.Body className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{employee.user.name}</h4>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Briefcase size={14} />
                                                <span>{employee.position}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-t border-gray-100 pt-4 mt-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <DollarSign size={14} /> Gaji Pokok
                                            </span>
                                            <span className="font-semibold text-gray-900">{formatRupiah(employee.base_salary)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <Percent size={14} /> Rate Komisi
                                            </span>
                                            <span className="font-semibold text-indigo-600">{formatRupiah(employee.commission_rate)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
                                        <button
                                            onClick={() => openModal(employee)}
                                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}

                        {employees.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <User size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Belum ada data karyawan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Sheet Modal for Add/Edit */}
            <BottomSheetModal
                isOpen={isOpen}
                onClose={closeModal}
                title={editData ? 'Edit Karyawan' : 'Tambah Karyawan'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {!editData && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required={!editData}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                        <input
                            type="text"
                            value={data.position}
                            onChange={(e) => setData('position', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok (Rp)</label>
                        <input
                            type="number"
                            value={data.base_salary}
                            onChange={(e) => setData('base_salary', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.base_salary && <p className="text-red-500 text-xs mt-1">{errors.base_salary}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate Komisi (Rp)</label>
                        <input
                            type="number"
                            value={data.commission_rate}
                            onChange={(e) => setData('commission_rate', e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {errors.commission_rate && <p className="text-red-500 text-xs mt-1">{errors.commission_rate}</p>}
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
                            {processing ? 'Memproses...' : editData ? 'Simpan Perubahan' : 'Tambah Karyawan'}
                        </button>
                    </div>
                </form>
            </BottomSheetModal>
        </AuthenticatedLayout>
    );
}
