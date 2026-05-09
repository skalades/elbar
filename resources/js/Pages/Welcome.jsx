import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Car, 
    Bike, 
    ShieldCheck, 
    Clock, 
    MapPin, 
    Phone, 
    Search, 
    Home, 
    Grid, 
    User,
    Sparkles,
    ChevronRight,
    Droplets
} from 'lucide-react';

export default function Welcome({ auth, categories }) {
    const [activeTab, setActiveTab] = useState('home');
    const [activeType, setActiveType] = useState('mobil');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredCategories = categories.filter(cat => cat.type === activeType);

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
            <Head title="Elbar | Premium Auto Detailing" />
            
            {/* Desktop Navbar (Hidden on Mobile) */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-black/80 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-6'} hidden md:block`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                            <Droplets className="text-white w-7 h-7" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter uppercase italic">Elbar</span>
                    </motion.div>
                    
                    <div className="flex items-center gap-8">
                        {['home', 'prices', 'about'].map((item) => (
                            <a 
                                key={item} 
                                href={`#${item}`}
                                className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-red-500 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                        <Link
                            href={auth.user ? route('dashboard') : route('login')}
                            className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                        >
                            {auth.user ? 'Dashboard' : 'Admin Area'}
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 md:hidden">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-2 flex justify-around items-center shadow-2xl">
                    {[
                        { id: 'home', icon: Home, label: 'Home', href: '#' },
                        { id: 'prices', icon: Grid, label: 'Prices', href: '#prices' },
                        { id: 'queue', icon: Search, label: 'Queue', href: '#queue' },
                        { id: 'profile', icon: User, label: 'Login', href: route('login') }
                    ].map((item) => (
                        <a 
                            key={item.id}
                            href={item.href}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-red-600 text-white scale-110 shadow-lg' : 'text-white/50 hover:text-white'}`}
                        >
                            <item.icon size={22} />
                            <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">{item.label}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <section id="home" className="relative min-h-[100svh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div 
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ duration: 2 }}
                        className="w-full h-full"
                    >
                        <img 
                            src="/elbar_hero_branded.png" 
                            className="w-full h-full object-cover grayscale-[0.2]" 
                            alt="Elbar Branded Hero"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-transparent z-10"></div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 mb-8">
                            <Sparkles size={16} />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Premium Auto Detailing</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-8 uppercase italic">
                            ELBAR <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">DETAILING.</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-white/60 max-w-2xl mb-12 leading-relaxed">
                            Bukan sekadar cuci biasa. Kami menghidupkan kembali kilau kendaraan Anda dengan teknologi coating & detailing tercanggih di Garut.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="#prices" 
                                className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-center shadow-2xl shadow-red-600/40 uppercase tracking-widest hover:bg-red-500 transition-all"
                            >
                                Lihat Layanan
                            </motion.a>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black text-center uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                <Search size={20} />
                                Cek Antrian
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <div className="absolute bottom-12 right-12 hidden lg:flex flex-col gap-6 items-end z-30">
                    <div className="flex items-center gap-4 text-right">
                        <div>
                            <p className="text-white font-black text-xl">07:30 - 18:00</p>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Open Daily</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                            <Clock className="text-red-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                        <div>
                            <p className="text-white font-black text-xl">Tarogong Kidul</p>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Garut, Indonesia</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                            <MapPin className="text-red-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Services with Generated Images */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Auto Detailing', img: '/elbar_detailing_branded.png', icon: Sparkles, color: 'red' },
                            { title: 'Ceramic Coating', img: '/elbar_coating_branded.png', icon: ShieldCheck, color: 'orange' },
                            { title: 'Motor Detailing', img: '/elbar_motor_branded.png', icon: Bike, color: 'blue' }
                        ].map((service, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="group relative h-[500px] rounded-[40px] overflow-hidden border border-white/10"
                            >
                                <img src={service.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" alt={service.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                        <service.icon className="text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase italic mb-2 tracking-tighter">{service.title}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed mb-6">Transformasi total kendaraan Anda dengan hasil yang memukau dan perlindungan jangka panjang.</p>
                                    <button className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                                        Selengkapnya <ChevronRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Price List Section */}
            <section id="prices" className="py-32 bg-[#0c0c0e] relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">Layanan <span className="text-red-600">&</span> Harga.</h2>
                            <p className="text-white/40 max-w-md uppercase font-bold tracking-[0.2em] text-xs">Pilih paket perawatan yang sesuai dengan kebutuhan kendaraan Anda.</p>
                        </motion.div>
                        
                        <div className="inline-flex p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <button 
                                onClick={() => setActiveType('mobil')}
                                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeType === 'mobil' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'text-white/40 hover:text-white'}`}
                            >
                                <Car size={16} /> Mobil
                            </button>
                            <button 
                                onClick={() => setActiveType('motor')}
                                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeType === 'motor' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'text-white/40 hover:text-white'}`}
                            >
                                <Bike size={16} /> Motor
                            </button>
                        </div>
                    </div>

                    {/* Category Nav Shortcuts */}
                    <div className="flex gap-4 overflow-x-auto pb-8 mb-12 scrollbar-hide no-scrollbar">
                        {filteredCategories.map((cat) => (
                            <a 
                                key={cat.id}
                                href={`#cat-${cat.id}`}
                                className="whitespace-nowrap px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:border-red-600 transition-colors"
                            >
                                {cat.name}
                            </a>
                        ))}
                    </div>

                    <div className="space-y-24">
                        <AnimatePresence mode="wait">
                            {filteredCategories.map((category) => (
                                <motion.div 
                                    key={category.id}
                                    id={`cat-${category.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    <div className="flex items-center gap-4 mb-12">
                                        <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                                            <span className="text-red-600">/</span> {category.name}
                                        </h3>
                                        <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {category.services.map((service) => (
                                            <motion.div 
                                                key={service.id}
                                                whileHover={{ y: -5 }}
                                                className="group bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-red-600/50 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between h-full shadow-lg"
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start gap-4 mb-6">
                                                        <div className="p-3 bg-red-600/10 rounded-2xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                            <Sparkles size={18} />
                                                        </div>
                                                        {service.vehicle_size && (
                                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                                                                {service.vehicle_size}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors leading-tight mb-2">
                                                        {service.name}
                                                    </h4>
                                                    {service.description && (
                                                        <p className="text-sm text-white/40 leading-relaxed font-medium">
                                                            {service.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-white/5">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xs font-bold text-white/40 uppercase">Rp</span>
                                                        <span className="text-3xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform inline-block origin-left">
                                                            {new Intl.NumberFormat('id-ID').format(service.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-4 gap-20">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                                    <Droplets className="text-white" />
                                </div>
                                <span className="text-4xl font-black tracking-tighter uppercase italic">Elbar</span>
                            </div>
                            <p className="text-white/40 text-xl max-w-md leading-relaxed mb-10 italic">
                                "The art of automotive perfection. Kami membawa standar kualitas baru untuk kendaraan Anda di Garut."
                            </p>
                            <div className="flex gap-6">
                                {[Phone, MapPin].map((Icon, i) => (
                                    <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-red-500 border border-white/10 hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                                        <Icon size={24} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-red-500">Links.</h4>
                            <ul className="space-y-6">
                                {['Layanan', 'Harga', 'Antrian Online', 'Admin Login'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white/60 font-bold hover:text-white transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-red-500">Workshop.</h4>
                            <div className="space-y-6 text-white/60 font-bold">
                                <p>Jl. Merdeka No. 09, Tarogong Kidul, Garut.</p>
                                <p className="text-white">Buka: 07:30 - 18:00 WIB</p>
                                <a href="tel:+628123456789" className="block text-red-500 text-xl font-black">+62 812 3456 789</a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-32 pt-10 border-t border-white/5 text-center">
                        <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">
                            © {new Date().getFullYear()} ELBAR AUTO DETAILING. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}


