import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge'; // Assuming Badge component exists

export default function MembershipIndex({ members, settings }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        loyalty_reward_threshold: settings.loyalty_reward_threshold || 10,
        segment_vip_visits: settings.segment_vip_visits || 5,
        segment_reguler_visits: settings.segment_reguler_visits || 1,
        segment_churning_days: settings.segment_churning_days || 30,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('membership.update-settings'), {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: show notification
            }
        });
    };

    const getSegmentColor = (segment) => {
        switch (segment) {
            case 'VIP': return 'bg-purple-100 text-purple-700';
            case 'Reguler': return 'bg-blue-100 text-blue-700';
            case 'Churning': return 'bg-red-100 text-red-700';
            default: return 'bg-green-100 text-green-700'; // Baru
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Membership</h2>}
        >
            <Head title="Membership" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Daftar Member */}
                        <div className="flex-1">
                            <Card>
                                <Card.Header className="bg-gray-50">
                                    <span className="font-semibold text-gray-800">Daftar Member</span>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3">Plat Nomor</th>
                                                    <th className="px-4 py-3">Segmen</th>
                                                    <th className="px-4 py-3">Total Kunjungan</th>
                                                    <th className="px-4 py-3">Poin</th>
                                                    <th className="px-4 py-3">Reward</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {members.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="px-4 py-4 text-center text-gray-400">Belum ada data member</td>
                                                    </tr>
                                                ) : (
                                                    members.map(member => (
                                                        <tr key={member.id} className="bg-white border-b hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-bold text-gray-900">{member.plate_number}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSegmentColor(member.segment)}`}>
                                                                    {member.segment}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">{member.total_visits}</td>
                                                            <td className="px-4 py-3 font-semibold text-indigo-600">{member.points}</td>
                                                            <td className="px-4 py-3 font-bold text-green-600">{member.available_rewards}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        {/* Pengaturan */}
                        <div className="w-full lg:w-96">
                            <Card className="sticky top-20">
                                <Card.Header className="bg-gray-50">
                                    <span className="font-semibold text-gray-800">Aturan Membership</span>
                                </Card.Header>
                                <Card.Body>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Poin Reward</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="number"
                                                    value={data.loyalty_reward_threshold}
                                                    onChange={e => setData('loyalty_reward_threshold', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                    min="1"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 text-sm">Poin</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Kelipatan poin untuk mendapatkan 1x cuci gratis.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Kunjungan VIP</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="number"
                                                    value={data.segment_vip_visits}
                                                    onChange={e => setData('segment_vip_visits', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                    min="0"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 text-sm">Kali</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Kunjungan Reguler</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="number"
                                                    value={data.segment_reguler_visits}
                                                    onChange={e => setData('segment_reguler_visits', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                    min="0"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 text-sm">Kali</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Batas Churning</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="number"
                                                    value={data.segment_churning_days}
                                                    onChange={e => setData('segment_churning_days', e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                    min="1"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 text-sm">Hari</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Jumlah hari tidak aktif hingga dianggap Churning.</p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                        </button>
                                    </form>
                                </Card.Body>
                            </Card>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
