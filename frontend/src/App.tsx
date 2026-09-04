import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
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
      return 'passport-search';
  }
}

function getTabFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!path) return null;

  if (path.startsWith('passport/')) {
    const batchId = path.split('/')[1];
    return batchId ? `passport-${batchId}` : 'passport-search';
  }
  if (path === 'passport') return 'passport-search';
  if (path === 'transport') return 'transporter';
  if (path === 'packaging') return 'packager';

  const validTabs = [
    'login', 'admin', 'beekeeper', 'processor', 'transporter', 
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
    return isAuthenticated ? getHomeTabForRole(currentRole) : 'login';
  });
  const [searchBatchId, setSearchBatchId] = useState<string>('HC-2026-0001');

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
    } else if (currentTab === 'passport-search') {
      targetPath = '/passport';
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
      if (!isAuthenticated && !currentTab.startsWith('passport-') && currentTab !== 'live-demo') {
        setCurrentTab('login');
      } else if (isAuthenticated && currentTab === 'login' && !fromPath) {
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
    // 1. Public Passport details (ALWAYS accessible without login)
    if (currentTab.startsWith('passport-') && currentTab !== 'passport-search') {
      const batchId = currentTab.replace('passport-', '');
      return (
        <HoneyPassportPage 
          batchId={batchId} 
          onBack={() => setCurrentTab(isAuthenticated ? getHomeTabForRole(currentRole) : 'passport-search')} 
        />
      );
    }

    // 2. Public Passport lookup
    if (currentTab === 'passport-search') {
      return (
        <div className="max-w-xl mx-auto py-12 px-6 bg-white rounded-2xl border border-[#EAE3D9] shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
            🍯
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Digital Honey Passport QR Lookup</h2>
            <p className="text-xs text-stone-500 mt-1">Enter a public batch identifier to inspect verified provenance</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
              placeholder="e.g. HC-2026-0001 or HC-2026-0003"
              className="flex-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-600 focus:bg-white transition"
            />
            <button
              onClick={() => setCurrentTab(`passport-${searchBatchId}`)}
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              Inspect Passport
            </button>
          </div>
          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 flex justify-center space-x-4">
            <button onClick={() => handleSearchPassport('HC-2026-0001')} className="text-amber-800 font-medium hover:underline">
              Try HC-2026-0001 (Verified)
            </button>
            <button onClick={() => handleSearchPassport('HC-2026-0003')} className="text-rose-800 font-medium hover:underline">
              Try HC-2026-0003 (Suspicious)
            </button>
          </div>
        </div>
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
          onOpenPublicPassport={() => setCurrentTab('passport-search')}
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
        return <BeekeeperPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;

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

  const isFullPageLogin = !isAuthenticated && currentTab === 'login';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Navbar 
        onSearchPassport={handleSearchPassport} 
        onNavigateLogin={() => setCurrentTab('login')} 
      />
      <div className="flex flex-1">
        {!isFullPageLogin && (
          <Sidebar currentTab={currentTab} onTabSelect={setCurrentTab} />
        )}
        <main className={`flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full ${isFullPageLogin ? 'flex items-center justify-center' : ''}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
