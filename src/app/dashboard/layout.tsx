import { Header } from '@/components/header';
import { ProtectedRoute } from '@/components/protected-route';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Header />
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </ProtectedRoute>
  );
}
