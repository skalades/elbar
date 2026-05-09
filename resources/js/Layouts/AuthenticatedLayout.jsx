import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Home, MonitorSmartphone, Car, Wrench, LogOut, User, Bell, ArrowLeft } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const low_stock_count = usePage().props.low_stock_count || 0;
    
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Simple role check based on Spatie roles
    // We assume the user has a roles array or can permission.
    // If not, we just check role attribute.
    const isOwner = user.role === 'Owner' || (user.roles && user.roles.some(r => r.name === 'Owner' || r.name === 'Superadmin'));

    return (
        <div className="min-h-screen bg-gray-100 pb-16 sm:pb-0">
            <nav className="border-b border-gray-100 bg-white sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>


                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-4">
                            {/* Notification Bell */}
                            {isOwner && (
                                <div className="relative">
                                    <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                        <Bell size={20} className={low_stock_count > 0 ? 'text-red-500 fill-red-500' : ''} />
                                        {low_stock_count > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                {low_stock_count}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}
                            
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Top Right Mobile Menu (For Logout/Profile) */}
                        <div className="-me-2 flex items-center sm:hidden gap-2">
                            {isOwner && (
                                <div className="relative">
                                    <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                        <Bell size={24} className={low_stock_count > 0 ? 'text-red-500 fill-red-500' : ''} />
                                        {low_stock_count > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                {low_stock_count}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <User size={24} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden absolute w-full bg-white shadow-lg border-b border-gray-100'}>
                    <div className="border-t border-gray-200 pb-3 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <Link href={route('profile.edit')} className="block w-full px-4 py-2 text-start text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 flex items-center gap-2">
                                <User size={18} /> Profile
                            </Link>
                            <Link method="post" href={route('logout')} as="button" className="block w-full px-4 py-2 text-start text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 flex items-center gap-2">
                                <LogOut size={18} /> Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-4">
                        {!route().current('dashboard') && (
                            <Link 
                                href={route('dashboard')} 
                                className="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center gap-2 font-medium text-sm"
                            >
                                <ArrowLeft size={18} />
                                <span className="hidden sm:inline">Kembali</span>
                            </Link>
                        )}
                        <div className="flex-1">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            <main>{children}</main>


        </div>
    );
}
