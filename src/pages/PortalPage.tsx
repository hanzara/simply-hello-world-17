import { useAuth } from '@/hooks/useAuth';
import { SellerPortalDashboard } from '@/components/seller-portal/SellerPortalDashboard';
import AuthPage from '@/pages/AuthPage';

const PortalPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <SellerPortalDashboard />;
};

export default PortalPage;