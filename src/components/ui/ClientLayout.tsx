'use client';

import Sidebar from '@/components/ui/Sidebar';
import { SessionProvider } from '@/contexts/SessionContext';
import './ClientLayout.css';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </SessionProvider>
    );
}

