import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="hidden h-[calc(100vh-4rem)] md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:top-16 z-40 bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 pt-16 min-h-[calc(100vh-4rem)]">
                {children}
            </main>
        </div>
    );
}
