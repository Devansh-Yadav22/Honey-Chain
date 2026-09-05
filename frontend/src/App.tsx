import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { VerifyHoneyModal } from './components/VerifyHoneyModal';
import { DashboardPage } from './pages/DashboardPage';
import { HiveListPage } from './pages/HiveListPage';
import { HiveDetailPage } from './pages/HiveDetailPage';
import { BatchListPage } from './pages/BatchListPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { HoneyPassportPage } from './pages/HoneyPassportPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BeekeeperPortal } from './pages/BeekeeperPortal';
import { ProcessorPortal } from './pages/ProcessorPortal';
import { TransportPortal } from './pages/TransportPortal';
import { PackagingPortal } from './pages/PackagingPortal';
import { QualityPortal } from './pages/QualityPortal';
import { LiveDemoPage } from './pages/LiveDemoPage';
import { LoginPage } from './pages/LoginPage';
import { AccessDenied } from './components/AccessDenied';
import { Role } from './types';

function getHomeTabForRole(role: Role): string {
  switch (role) {
    case 'ADMIN':
      return 'admin';
    case 'BEEKEEPER':
      return 'beekeeper';
    case 'PROCESSOR':
      return 'processor';
    case 'TRANSPORTER':
      return 'transporter';
    case 'PACKAGER':
      return 'packager';
    case 'QUALITY_LAB':
      return 'quality';
    case 'CONSUMER':
    default:
      return 'landing';
  }
}

function getTabFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!path) return 'landing';

  if (path.startsWith('passport/')) {
    const batchId = path.split('/')[1];
    return batchId ? `passport-${batchId}` : 'landing';
  }
  if (path === 'passport') return 'landing';
  if (path === 'transport') return 'transporter';
  if (path === 'packaging') return 'packager';

  const validTabs = [
    'landing', 'login', 'admin', 'beekeeper', 'processor', 'transporter', 
    'packager', 'quality', 'hives', 'batches', 'live-demo', 'dashboard'
  ];
  if (validTabs.includes(path)) return path;
  return null;
}

function MainApp() {
  const { currentRole, isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const fromPath = getTabFromPath();
    if (fromPath) return fromPath;
    return isAuthenticated ? getHomeTabForRole(currentRole) : 'landing';
  });
  const [searchBatchId, setSearchBatchId] = useState<string>('HC-2026-0001');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Sync state when browser back/forward buttons are clicked
  useEffect(() => {
    const handlePopState = () => {
      const fromPath = getTabFromPath();
      if (fromPath) {
        setCurrentTab(fromPath);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync URL in browser address bar when tab changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let targetPath = '/';
    if (currentTab.startsWith('passport-') && currentTab !== 'passport-search') {
      const id = currentTab.replace('passport-', '');
      targetPath = `/passport/${id}`;
    } else if (currentTab === 'passport-search' || currentTab === 'landing') {
      targetPath = '/';
    } else if (currentTab === 'transporter') {
      targetPath = '/transport';
    } else if (currentTab === 'packager') {
      targetPath = '/packaging';
    } else if (currentTab && currentTab !== 'dashboard') {
      targetPath = `/${currentTab}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: currentTab }, '', targetPath);
    }
  }, [currentTab]);

  // Update default landing tab when auth state resolves
  useEffect(() => {
    if (!loading) {
      const fromPath = getTabFromPath();
      if (!isAuthenticated && !currentTab.startsWith('passport-') && currentTab !== 'live-demo' && currentTab !== 'landing') {
        if (currentTab !== 'login') {
          // If accessing protected tab when unauth, go to login
          setCurrentTab('login');
        }
      } else if (isAuthenticated && (currentTab === 'login' || currentTab === 'landing') && !fromPath) {
        setCurrentTab(getHomeTabForRole(currentRole));
      }
    }
  }, [isAuthenticated, loading, currentRole]);

  const handleSearchPassport = (batchId: string) => {
    setSearchBatchId(batchId);
    setCurrentTab(`passport-${batchId}`);
  };

  const handleLoginSuccess = (role: Role) => {
    const target = getHomeTabForRole(role);
    setCurrentTab(target);
  };

  const renderContent = () => {
    // 1. Public Landing Page (Default for root / unauth)
    if (currentTab === 'landing') {
      return (
        <LandingPage
          onVerifyBatch={handleSearchPassport}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
          onNavigateLogin={() => setCurrentTab('login')}
        />
      );
    }

    // 2. Public Passport details (ALWAYS accessible without login)
    if (currentTab.startsWith('passport-') && currentTab !== 'passport-search') {
      const batchId = currentTab.replace('passport-', '');
      return (
        <HoneyPassportPage 
          batchId={batchId} 
          onBack={() => setCurrentTab(isAuthenticated ? getHomeTabForRole(currentRole) : 'landing')} 
        />
      );
    }

    // 3. Live Demo (Interactive Showcase)
    if (currentTab === 'live-demo') {
      return <LiveDemoPage onOpenPassport={(id) => handleSearchPassport(id)} />;
    }

    // 4. Unauthenticated user accessing protected dashboard -> show Login Page
    if (!isAuthenticated) {
      return (
        <LoginPage 
          onSuccessRedirect={handleLoginSuccess}
          onOpenPublicPassport={() => setCurrentTab('landing')}
        />
      );
    }

    // 5. Nested entity views
    if (currentTab.startsWith('hive-')) {
      const hiveId = currentTab.replace('hive-', '');
      return <HiveDetailPage hiveId={hiveId} onBack={() => setCurrentTab('hives')} />;
    }

    if (currentTab.startsWith('batch-')) {
      const batchId = currentTab.replace('batch-', '');
      return (
        <BatchDetailPage
          batchId={batchId}
          onBack={() => setCurrentTab('batches')}
          onOpenPassport={(id) => handleSearchPassport(id)}
        />
      );
    }

    // 6. Role-Protected Participant Dashboards with Access Control
    switch (currentTab) {
      case 'admin':
        if (currentRole !== 'ADMIN') {
          return (
            <AccessDenied
              requiredRole="ADMIN"
              attemptedSection="Platform Admin Command Center"
              onNavigateHome={() => setCurrentTab(getHomeTabForRole(currentRole))}
              onOpenPassport={handleSearchPassport}
            />
          );
        }
        return (
          <AdminDashboardPage 
            onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} 
            onOpenPassport={(id) => handleSearchPassport(id)} 
          />
        );

      case 'beekeeper':
        if (currentRole !== 'BEEKEEPER' && currentRole !== 'ADMIN') {
          return (
            <AccessDenied
              requiredRole={['BEEKEEPER', 'ADMIN']}
              attemptedSection="Beekeeper Workspace"
              onNavigateHome={() => setCurrentTab(getHomeTabForRole(currentRole))}
              onOpenPassport={handleSearchPassport}
            />
          );
        }
        return (
          <BeekeeperPortal 
            onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} 
            onOpenPassport={(id) => handleSearchPassport(id)}
          />
        );

      case 'processor':
        if (currentRole !== 'PROCESSOR' && currentRole !== 'ADMIN') {
          return (
            <AccessDenied
              requiredRole={['PROCESSOR', 'ADMIN']}
              attemptedSection="Processing Facility"
              onNavigateHome={() => setCurrentTab(getHomeTabForRole(currentRole))}
              onOpenPassport={handleSearchPassport}
            />
          );
        }
        return <ProcessorPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;

      case 'transporter':
        if (currentRole !== 'TRANSPORTER' && currentRole !== 'ADMIN') {
          return (
            <AccessDenied
              requiredRole={['TRANSPORTER', 'ADMIN']}
              attemptedSection="Logistics Fleet Management"
              onNavigateHome={() => setCurrentTab(getHomeTabForRole(currentRole))}
              onOpenPassport={handleSearchPassport}
            />
          );
        }
        return <TransportPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;

      case 'packager':
        if (currentRole !== 'PACKAGER' && currentRole !== 'ADMIN') {
          return (
            <AccessDenied
              requiredRole={['PACKAGER', 'ADMIN']}
              attemptedSection="Packaging Hub"
              onNavigateHome={() => setCurrentTab(getHomeTabForRole(currentRole))}
              onOpenPassport={handleSearchPassport}
            />
          );
        }
        return <PackagingPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;

      case 'quality':
        if (currentRole !== 'QUALITY_LAB' && currentRole !== 'ADMIN') {
          return (
            <AccessDenied
              requiredRole={['QUALITY_LAB', 'ADMIN']}
              attemptedSection="Quality & Lab Testing Portal"
              onNavigateHome={() => setCurrentTab(getHomeTabForRole(currentRole))}
              onOpenPassport={handleSearchPassport}
            />
          );
        }
        return <QualityPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;

      case 'hives':
        return <HiveListPage onSelectHive={(id) => setCurrentTab(`hive-${id}`)} />;

      case 'batches':
        return <BatchListPage onSelectBatch={(id) => setCurrentTab(`batch-${id}`)} />;

      case 'dashboard':
      default:
        return <DashboardPage onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  const isFullPage = currentTab === 'landing' || (!isAuthenticated && currentTab === 'login');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Navbar 
        onSearchPassport={handleSearchPassport} 
        onNavigateLogin={() => setCurrentTab('login')} 
        onNavigateHome={() => setCurrentTab(isAuthenticated ? getHomeTabForRole(currentRole) : 'landing')}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
      />
      <div className="flex flex-1">
        {!isFullPage && (
          <Sidebar currentTab={currentTab} onTabSelect={setCurrentTab} />
        )}
        <main className={`flex-1 ${currentTab === 'landing' ? 'p-0 w-full' : 'p-5 md:p-8 max-w-7xl mx-auto w-full'} ${!isAuthenticated && currentTab === 'login' ? 'flex items-center justify-center' : ''}`}>
          {renderContent()}
        </main>
      </div>

      {/* Quick QR & Batch Lookup Modal */}
      <VerifyHoneyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerifyBatch={(id) => {
          setIsVerifyModalOpen(false);
          handleSearchPassport(id);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;

