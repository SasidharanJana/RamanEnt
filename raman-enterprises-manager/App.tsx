
import React, { useState, useEffect } from 'react';
import { ViewType, BusinessProfile } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Purchases from './components/Purchases';
import Projects from './components/Projects';
import Reports from './components/Reports';
import DesktopConfig from './components/DesktopConfig';
import BusinessSettings from './components/BusinessSettings';
import Monetization from './components/Monetization';
import { getBusinessProfile } from './store/db';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');
  const [profile, setProfile] = useState<BusinessProfile>(getBusinessProfile());

  useEffect(() => {
    // Sync profile on mount
    setProfile(getBusinessProfile());
  }, []);

  const navigation = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'INVENTORY', label: 'Inventory', icon: 'fa-boxes-stacked' },
    { id: 'PURCHASES', label: 'Purchases', icon: 'fa-receipt' },
    { id: 'PROJECTS', label: 'Projects', icon: 'fa-helmet-safety' },
    { id: 'REPORTS', label: 'Reports', icon: 'fa-chart-pie' },
    { id: 'BUSINESS_SETTINGS', label: 'Whitelabeling', icon: 'fa-id-card' },
    { id: 'DESKTOP_CONFIG', label: 'Desktop Dist.', icon: 'fa-desktop' },
    { id: 'MONETIZATION', label: 'Sell This App', icon: 'fa-rocket' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'DASHBOARD': return <Dashboard />;
      case 'INVENTORY': return <Inventory />;
      case 'PURCHASES': return <Purchases />;
      case 'PROJECTS': return <Projects />;
      case 'REPORTS': return <Reports />;
      case 'BUSINESS_SETTINGS': return <BusinessSettings />;
      case 'DESKTOP_CONFIG': return <DesktopConfig />;
      case 'MONETIZATION': return <Monetization />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 text-slate-900 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-opacity-20"
              style={{ backgroundColor: profile.logoColor }}
            >
              <i className="fas fa-bolt text-lg text-white"></i>
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm tracking-tight text-slate-800 uppercase truncate">
                {profile.companyName}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Suite</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeView === item.id 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={activeView === item.id ? { backgroundColor: profile.logoColor, boxShadow: `0 10px 15px -3px ${profile.logoColor}40` } : {}}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Reseller Mode</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">{profile.companyName}</p>
            <p className="text-[10px] text-slate-500 mt-1">Licensed for Distribution</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-slate-400">
            <i className="fas fa-clock text-xs"></i>
            <span className="text-xs font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">GSTIN:</span>
                <span className="text-xs font-mono font-bold text-slate-800">{profile.gstin}</span>
             </div>
             <div className="h-8 w-px bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-3 cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{profile.ownerName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">System Proprietor</p>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: profile.logoColor }}
                >
                  {profile.companyName.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
