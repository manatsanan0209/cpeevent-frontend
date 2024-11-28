import { useState } from 'react';
import { Link } from '@nextui-org/link';
import { FaHeart } from 'react-icons/fa6';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="relative flex h-screen">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <div className="flex flex-col w-full h-full md:ml-64">
                <Navbar onHamburgerClick={toggleSidebar} />
                <main className="container mx-auto max-w-7xl px-6 flex-grow">
                    {children}
                </main>
                <footer className="w-full flex items-center justify-center py-3">
                    <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
                        title="nextui.org homepage"
                    >
                        <span className="text-default-600">Made with</span>
                        <FaHeart className="text-red-500 ml-1" />
                    </Link>
                </footer>
            </div>
        </div>
    );
}
