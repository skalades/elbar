import React, { useState, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import FloatingActionButton from '@/Components/FloatingActionButton';
import BottomSheetModal from '@/Components/BottomSheetModal';
import PrinterStatusBadge from '@/Components/PrinterStatusBadge';
import PrinterSettings from '@/Components/PrinterSettings';
import useThermalPrinter from '@/hooks/useThermalPrinter';
import { ShoppingCart, Car, Plus, Minus, Trash2, Printer, CheckCircle, XCircle, Bluetooth } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';

export default function POSIndex({ categories, services, queues }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { flash } = usePage().props;
    
    // For Struk Modal
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        plate_number: '',
        service_ids: [],
        payment_method: 'tunai',
        jumlah_bayar: '',
        voucher_code: '',
    });
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const [isPrinterSettingsOpen, setIsPrinterSettingsOpen] = useState(false);

    // Bluetooth Thermal Printer Hook
    const {
        isSupported: printerSupported,
        isConnected: printerConnected,
        status: printerStatus,
        printerName,
        error: printerError,
        connect: connectPrinter,
        disconnect: disconnectPrinter,
        printReceipt,
        clearError: clearPrinterError,
    } = useThermalPrinter({
        cashierName: usePage().props.auth?.user?.name || '-',
    });

    // Watch for flash success
    useEffect(() => {
        if (flash.success && flash.order) {
            setLastOrder(flash.order);
            setIsSuccessModalOpen(true);
        }
    }, [flash]);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (data.plate_number.length >= 4) {
                try {
                    const response = await fetch(`/vehicles/${data.plate_number}`);
                    const result = await response.json();
                    if (result.success) {
                        setVehicleInfo(result.data);
                    } else {
                        setVehicleInfo(null);
                    }
                } catch (error) {
                    setVehicleInfo(null);
                }
            } else {
                setVehicleInfo(null);
            }
        };

        const timeoutId = setTimeout(fetchVehicle, 500);
        return () => clearTimeout(timeoutId);
    }, [data.plate_number]);

    const addToCart = (service) => {
        if (!cart.find(item => item.id === service.id)) {
            const newCart = [...cart, service];
            setCart(newCart);
            setData('service_ids', newCart.map(s => s.id));
        }
    };

    const removeFromCart = (serviceId) => {
        const newCart = cart.filter(item => item.id !== serviceId);
        setCart(newCart);
        setData('service_ids', newCart.map(s => s.id));
    };

    const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price), 0), [cart]);
    const kembalian = useMemo(() => {
        if (data.payment_method !== 'tunai' || !data.jumlah_bayar) return 0;
        const bayar = Number(data.jumlah_bayar);
        return bayar > total ? bayar - total : 0;
    }, [data.jumlah_bayar, data.payment_method, total]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pos.store'), {
            onSuccess: () => {
                setCart([]);
                reset();
                setIsCartOpen(false);
            }
        });
    };

    const handlePlateChange = (e) => {
        // Auto uppercase and format
        let val = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
        setData('plate_number', val);
    };

    const handlePrintStruk = async () => {
        if (!lastOrder) return;
        await printReceipt(lastOrder);
    };

    const handleStatusChange = (orderId, newStatus) => {
        router.post(route('queue.update-status', orderId), {
            status: newStatus
        }, {
            preserveScroll: true
        });
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
        setLastOrder(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center print:hidden">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Kasir (POS)</h2>
                    <div className="flex items-center gap-2">
                        <PrinterStatusBadge
                            isSupported={printerSupported}
                            isConnected={printerConnected}
                            status={printerStatus}
                            printerName={printerName}
                            onClick={() => setIsPrinterSettingsOpen(true)}
                        />
                        <button
                            onClick={() => setIsQueueOpen(true)}
                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Car size={16} /> Antrian ({queues.length})
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Kasir POS" />

            <div className="py-8 print:hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Main Content - Services List */}
                        <div className="flex-1 space-y-6">
                            {categories.map(category => (
                                <div key={category.id} className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">{category.name}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {category.services.map(service => {
                                            const isSelected = cart.find(item => item.id === service.id);
                                            return (
                                                <Card 
                                                    key={service.id} 
                                                    onClick={() => isSelected ? removeFromCart(service.id) : addToCart(service)}
                                                    className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : 'hover:border-indigo-200'}`}
                                                >
                                                    <Card.Body className="flex flex-col items-center justify-center text-center py-6">
                                                        <div className={`p-3 rounded-full mb-3 ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                                            <Car size={24} />
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                                                        <p className="text-sm text-indigo-600 font-semibold">{formatRupiah(service.price)}</p>
                                                        {service.vehicle_size && (
                                                            <span className="text-xs text-gray-500 mt-1">Ukuran: {service.vehicle_size}</span>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar / Cart (Desktop) */}
                        <div className="hidden lg:block w-96">
                            <Card className="sticky top-20">
                                <Card.Header className="flex justify-between items-center bg-gray-50">
                                    <span className="flex items-center gap-2 font-semibold">
                                        <ShoppingCart size={18} />
                                        Keranjang
                                    </span>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs py-1 px-2 rounded-full font-semibold">
                                        {cart.length} Item
                                    </span>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <form onSubmit={handleSubmit} className="p-5 flex flex-col h-[calc(100vh-16rem)] max-h-[600px]">
                                        
                                        {/* Input Plat */}
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
                                            <input
                                                type="text"
                                                value={data.plate_number}
                                                onChange={handlePlateChange}
                                                placeholder="B 1234 XYZ"
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 uppercase font-bold tracking-widest text-lg"
                                                required
                                            />
                                            {errors.plate_number && <p className="text-red-500 text-xs mt-1">{errors.plate_number}</p>}
                                        </div>

                                        {vehicleInfo && (
                                            <div className="mb-5 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-medium text-gray-500">Segmen</span>
                                                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                                        {vehicleInfo.segment}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-medium text-gray-500">Poin</span>
                                                    <span className="text-sm font-bold text-gray-900">{vehicleInfo.points}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium text-gray-500">Reward Gratis</span>
                                                    <span className="text-sm font-bold text-green-600">{vehicleInfo.available_rewards}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Cart Items */}
                                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-5">
                                            {cart.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                    <ShoppingCart size={48} className="mb-2 opacity-30" />
                                                    <p className="text-sm">Belum ada layanan dipilih</p>
                                                </div>
                                            ) : (
                                                cart.map(item => (
                                                    <div key={item.id} className="flex justify-between items-start border-b border-gray-50 pb-3">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                            <p className="text-xs text-indigo-600 font-semibold">{formatRupiah(item.price)}</p>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 ml-2 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                            {errors.service_ids && <p className="text-red-500 text-xs mt-1">{errors.service_ids}</p>}
                                        </div>

                                        {/* Checkout Section */}
                                        <div className="border-t border-gray-100 pt-4 mt-auto">
                                            {/* Voucher Input */}
                                            <div className="mb-4">
                                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Kode Voucher</label>
                                                <input
                                                    type="text"
                                                    value={data.voucher_code}
                                                    onChange={e => setData('voucher_code', e.target.value.toUpperCase())}
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-bold uppercase"
                                                    placeholder="KODE VOUCHER"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Metode Pembayaran</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['tunai', 'qris', 'transfer'].map((method) => (
                                                        <button
                                                            key={method}
                                                            type="button"
                                                            onClick={() => setData('payment_method', method)}
                                                            className={`py-2 px-1 text-xs font-bold rounded-lg capitalize border transition-colors ${data.payment_method === method ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                                        >
                                                            {method}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {data.payment_method === 'tunai' && (
                                                <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Jumlah Bayar (Rp)</label>
                                                    <input
                                                        type="text"
                                                        value={data.jumlah_bayar ? data.jumlah_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                                        onChange={e => {
                                                            let rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                            setData('jumlah_bayar', rawValue);
                                                        }}
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg font-bold"
                                                        placeholder="0"
                                                    />
                                                    {data.jumlah_bayar && (
                                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                                            <span className="text-xs font-medium text-gray-500">Kembalian</span>
                                                            <span className={`text-sm font-bold ${kembalian > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                                {formatRupiah(kembalian)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-end mb-4">
                                                <span className="text-gray-600 font-medium">Total Tagihan</span>
                                                <span className="text-2xl font-black text-indigo-700">{formatRupiah(total)}</span>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={processing || cart.length === 0 || !data.plate_number}
                                                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm"
                                            >
                                                {processing ? 'Memproses...' : 'Proses Order & Bayar'}
                                            </button>
                                        </div>
                                    </form>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Cart FAB */}
            <FloatingActionButton 
                icon={<ShoppingCart size={24} />} 
                badgeCount={cart.length} 
                onClick={() => setIsCartOpen(true)} 
            />

            {/* Mobile Cart Bottom Sheet */}
            <BottomSheetModal 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                title="Keranjang Order"
            >
                <form onSubmit={handleSubmit} className="flex flex-col min-h-[60vh] max-h-[80vh]">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
                        <input
                            type="text"
                            value={data.plate_number}
                            onChange={handlePlateChange}
                            placeholder="B 1234 XYZ"
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 uppercase font-bold text-lg"
                            required
                        />
                    </div>

                    <div className="flex-1 mb-4 overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">Keranjang kosong</div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b border-gray-100 py-2 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-indigo-600 font-bold">{formatRupiah(item.price)}</p>
                                    </div>
                                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-400 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-auto">
                        {/* Voucher Input */}
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Kode Voucher</label>
                            <input
                                type="text"
                                value={data.voucher_code}
                                onChange={e => setData('voucher_code', e.target.value.toUpperCase())}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-bold uppercase"
                                placeholder="KODE VOUCHER"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Metode Pembayaran</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['tunai', 'qris', 'transfer'].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setData('payment_method', method)}
                                        className={`py-2 text-xs font-bold rounded-lg capitalize border ${data.payment_method === method ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {data.payment_method === 'tunai' && (
                            <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Jumlah Bayar (Rp)</label>
                                <input
                                    type="text"
                                    value={data.jumlah_bayar ? data.jumlah_bayar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                    onChange={e => {
                                        let rawValue = e.target.value.replace(/[^0-9]/g, '');
                                        setData('jumlah_bayar', rawValue);
                                    }}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg font-bold"
                                    placeholder="0"
                                />
                                {data.jumlah_bayar && (
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                        <span className="text-xs font-medium text-gray-500">Kembalian</span>
                                        <span className={`text-sm font-bold ${kembalian > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                            {formatRupiah(kembalian)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between items-end mb-4 px-1">
                            <span className="text-gray-600 font-medium">Total Tagihan</span>
                            <span className="text-2xl font-black text-indigo-700">{formatRupiah(total)}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || cart.length === 0 || !data.plate_number}
                            className="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl flex justify-center disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : 'Proses Order & Bayar'}
                        </button>
                    </div>
                </form>
            </BottomSheetModal>

            {/* Success & Print Modal */}
            {isSuccessModalOpen && lastOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 print:hidden">
                    <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">Order Berhasil!</h3>
                        <p className="text-sm text-gray-500 mb-6">No: {lastOrder.order_number}</p>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span className="text-sm text-gray-500">Plat Nomor</span>
                                <span className="font-bold text-gray-900">{lastOrder.vehicle?.plate_number}</span>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                <span className="text-sm text-gray-500">Total Pembayaran</span>
                                <span className="font-bold text-indigo-600">{formatRupiah(lastOrder.total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Metode</span>
                                <span className="font-bold text-gray-900 uppercase">{lastOrder.payment_method}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handlePrintStruk}
                                disabled={printerStatus === 'printing'}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {printerStatus === 'printing' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Mencetak...
                                    </>
                                ) : (
                                    <>
                                        {printerConnected ? <Bluetooth size={20} /> : <Printer size={20} />}
                                        {printerConnected ? 'Cetak via Bluetooth' : 'Cetak Struk (Browser)'}
                                    </>
                                )}
                            </button>
                            {!printerConnected && printerSupported && (
                                <button
                                    onClick={connectPrinter}
                                    className="w-full inline-flex justify-center items-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                                >
                                    <Bluetooth size={16} /> Hubungkan Printer Bluetooth
                                </button>
                            )}
                            <button
                                onClick={closeSuccessModal}
                                className="w-full inline-flex justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-base font-bold text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Tutup & Buat Order Baru
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Only View (58mm Thermal Style) */}
            {lastOrder && (
                <div className="hidden print:block w-[58mm] text-black font-mono text-xs p-0 m-0 leading-tight">
                    <div className="text-center mb-2">
                        <h1 className="text-base font-bold uppercase mb-1">ELBAR CAR WASH</h1>
                        <p className="text-[10px]">Jl. Contoh No. 123, Kota</p>
                        <p className="text-[10px]">Telp: 08123456789</p>
                        <div className="border-b border-black border-dashed my-1"></div>
                    </div>

                    <div className="mb-2">
                        <div className="flex justify-between">
                            <span>No:</span>
                            <span>{lastOrder.order_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Plat:</span>
                            <span className="font-bold">{lastOrder.vehicle?.plate_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu:</span>
                            <span>{new Date(lastOrder.created_at).toLocaleString('id-ID', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kasir:</span>
                            <span>{usePage().props.auth.user.name}</span>
                        </div>
                    </div>

                    <div className="border-b border-black border-dashed my-1"></div>

                    <div className="mb-2">
                        {lastOrder.items?.map(item => (
                            <div key={item.id} className="mb-1">
                                <div className="text-left font-bold">{item.service?.name || 'Layanan'}</div>
                                <div className="flex justify-between">
                                    <span>1 x {formatRupiah(item.price)}</span>
                                    <span>{formatRupiah(item.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-b border-black border-dashed my-1"></div>

                    <div className="mb-2">
                        <div className="flex justify-between font-bold text-sm">
                            <span>TOTAL:</span>
                            <span>{formatRupiah(lastOrder.total)}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Metode:</span>
                            <span className="uppercase">{lastOrder.payment_method}</span>
                        </div>
                    </div>

                    <div className="border-b border-black border-dashed my-1"></div>

                    <div className="text-center mt-3 text-[10px]">
                        <p className="mb-1">Terima Kasih</p>
                        <p>Silakan tunggu di ruang tunggu.</p>
                        <br/>
                        <br/>
                        <p>.</p> {/* Added to ensure it scrolls a bit before cutting */}
                    </div>
                </div>
            )}
            
            {/* Force CSS for printing */}
            <style>
                {`
                @media print {
                    @page {
                        margin: 0;
                        size: 58mm auto;
                    }
                    body * {
                        visibility: hidden;
                    }
                    .print\\:block, .print\\:block * {
                        visibility: visible;
                    }
                    .print\\:block {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 58mm;
                        padding: 2mm;
                        margin: 0;
                    }
                }
                `}
            </style>
            {/* Queue Modal */}
            {isQueueOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 print:hidden">
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black text-gray-900">Antrian Hari Ini</h3>
                            <button onClick={() => setIsQueueOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto max-h-[60vh]">
                            {queues.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">Tidak ada antrian aktif</div>
                            ) : (
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3">No Order</th>
                                            <th className="px-4 py-3">Plat</th>
                                            <th className="px-4 py-3">Layanan</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queues.map(queue => (
                                            <tr key={queue.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{queue.order_number}</td>
                                                <td className="px-4 py-3 font-bold">{queue.vehicle?.plate_number}</td>
                                                <td className="px-4 py-3">
                                                    {queue.items?.map(item => item.service?.name).join(', ')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={queue.status}
                                                        onChange={(e) => handleStatusChange(queue.id, e.target.value)}
                                                        className={`text-xs font-bold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 ${queue.status === 'dicuci' ? 'bg-yellow-100 text-yellow-700' : queue.status === 'selesai' ? 'bg-green-100 text-green-700' : queue.status === 'dibatalkan' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                                                    >
                                                        <option value="menunggu">menunggu</option>
                                                        <option value="dicuci">dicuci</option>
                                                        <option value="selesai">selesai</option>
                                                        <option value="dibatalkan">dibatalkan</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Printer Settings Modal */}
            <PrinterSettings
                isOpen={isPrinterSettingsOpen}
                onClose={() => setIsPrinterSettingsOpen(false)}
                isSupported={printerSupported}
                isConnected={printerConnected}
                status={printerStatus}
                printerName={printerName}
                error={printerError}
                onConnect={connectPrinter}
                onDisconnect={disconnectPrinter}
                onClearError={clearPrinterError}
            />
        </AuthenticatedLayout>
    );
}
