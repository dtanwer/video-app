import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-[calc(100vh-5rem)] bg-background">
            <Sidebar />
            <main className="md:pl-72 pt-16">
                {children}
            </main>
        </div>
    );
}
