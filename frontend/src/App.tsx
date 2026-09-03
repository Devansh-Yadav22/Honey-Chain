import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { HiveListPage } from './pages/HiveListPage';
import { HiveDetailPage } from './pages/HiveDetailPage';
import { BatchListPage } from './pages/BatchListPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { HoneyPassportPage } from './pages/HoneyPassportPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchBatchId, setSearchBatchId] = useState<string>('HC-2026-0001');

  const handleSearchPassport = (batchId: string) => {
    setSearchBatchId(batchId);
    setCurrentTab(`passport-${batchId}`);
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
      return <HoneyPassportPage batchId={batchId} onBack={() => setCurrentTab('dashboard')} />;
    }

    switch (currentTab) {
      case 'hives':
        return <HiveListPage onSelectHive={(id) => setCurrentTab(`hive-${id}`)} />;
      case 'batches':
        return <BatchListPage onSelectBatch={(id) => setCurrentTab(`batch-${id}`)} />;
      case 'passport-search':
        return (
          <div className="max-w-xl mx-auto py-8 space-y-6 text-center">
            <h2 className="text-xl font-bold text-stone-100">Honey Passport QR Verification Lookup</h2>
            <p className="text-xs text-stone-400">Enter a batch identifier to view its on-chain provenance certificate</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchBatchId}
                onChange={(e) => setSearchBatchId(e.target.value)}
                placeholder="e.g. HC-2026-0001 or HC-2026-0003"
                className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 outline-none focus:border-amber-500"
              />
              <button
                onClick={() => setCurrentTab(`passport-${searchBatchId}`)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
              >
                Inspect Passport
              </button>
            </div>
            <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 flex justify-center space-x-4">
              <button onClick={() => handleSearchPassport('HC-2026-0001')} className="text-amber-400 hover:underline">
                Try HC-2026-0001 (Verified)
              </button>
              <button onClick={() => handleSearchPassport('HC-2026-0003')} className="text-rose-400 hover:underline">
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <Navbar onSearchPassport={handleSearchPassport} />
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} onTabSelect={setCurrentTab} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
