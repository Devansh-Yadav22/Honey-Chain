import React, { useState } from 'react';
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
import { Role } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('admin');
  const [searchBatchId, setSearchBatchId] = useState<string>('HC-2026-0001');
  const { currentRole, switchRole } = useAuth();

  const handleSearchPassport = (batchId: string) => {
    setSearchBatchId(batchId);
    setCurrentTab(`passport-${batchId}`);
  };

  const handleRoleSelect = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        setCurrentTab('admin');
        break;
      case 'BEEKEEPER':
        setCurrentTab('beekeeper');
        break;
      case 'PROCESSOR':
        setCurrentTab('processor');
        break;
      case 'TRANSPORTER':
        setCurrentTab('transporter');
        break;
      case 'PACKAGER':
        setCurrentTab('packager');
        break;
      case 'QUALITY_LAB':
        setCurrentTab('quality');
        break;
      case 'CONSUMER':
        setCurrentTab(`passport-${searchBatchId}`);
        break;
    }
  };

  const renderContent = () => {
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

    if (currentTab.startsWith('passport-')) {
      const batchId = currentTab.replace('passport-', '');
      return <HoneyPassportPage batchId={batchId} onBack={() => setCurrentTab('admin')} />;
    }

    switch (currentTab) {
      case 'live-demo':
        return <LiveDemoPage onOpenPassport={(id) => handleSearchPassport(id)} />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'beekeeper':
        return <BeekeeperPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;
      case 'processor':
        return <ProcessorPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;
      case 'transporter':
        return <TransportPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;
      case 'packager':
        return <PackagingPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;
      case 'quality':
        return <QualityPortal onNavigateToBatch={(id) => setCurrentTab(`batch-${id}`)} />;
      case 'hives':
        return <HiveListPage onSelectHive={(id) => setCurrentTab(`hive-${id}`)} />;
      case 'batches':
        return <BatchListPage onSelectBatch={(id) => setCurrentTab(`batch-${id}`)} />;
      case 'passport-search':
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
      case 'dashboard':
      default:
        return <DashboardPage onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Navbar onSearchPassport={handleSearchPassport} onSelectRole={handleRoleSelect} />
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} onTabSelect={setCurrentTab} />
        <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full">
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
