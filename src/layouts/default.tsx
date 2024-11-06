import { Link } from '@nextui-org/link';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex h-screen">
            <Sidebar />
            <div className="flex flex-col w-full h-full ml-64">
                <Navbar />
                <main className="container mx-auto max-w-7xl px-6 flex-grow mb-[1000px]">
                    {children}
                </main>
                <footer className="w-full flex  items-center justify-center py-3">
                    <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
                        title="nextui.org homepage"
                    >
                        <span className="text-default-600">Powered by</span>
                        <p className="text-primary">NextUI</p>
                    </Link>
                </footer>
            </div>
        </div>
    );
}
