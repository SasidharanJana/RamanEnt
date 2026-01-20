
import React, { useRef, useState, useEffect } from 'react';
import { exportFullDatabase, importDatabase, getBusinessProfile } from '../store/db';
import { BusinessProfile } from '../types';

const DesktopConfig: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeTab, setActiveTab] = useState<'PACKAGE' | 'MAINTENANCE' | 'AUDIT'>('PACKAGE');
  const [profile] = useState<BusinessProfile>(getBusinessProfile());

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importDatabase(content)) {
          alert("Database imported successfully! Application will now refresh.");
        } else {
          alert("Failed to import. Invalid file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const copyInstallLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Installation Link copied to clipboard! Send this to your client.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-widest">Distribution Center</span>
            {isStandalone && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1">
                <i className="fas fa-check-circle"></i> Running as Desktop App
              </span>
            )}
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Software Packaging</h2>
          <p className="text-slate-500 mt-1">Deploy and manage this suite on client hardware.</p>
        </div>
        
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 self-start overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTab('PACKAGE')}
            className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'PACKAGE' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-box-open mr-2"></i> Distribution
          </button>
          <button 
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'AUDIT' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-clipboard-check mr-2"></i> Production Audit
          </button>
          <button 
            onClick={() => setActiveTab('MAINTENANCE')}
            className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'MAINTENANCE' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-database mr-2"></i> Data
          </button>
        </div>
      </header>

      {activeTab === 'PACKAGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Desktop Installation Steps</h3>
                  <p className="text-slate-500 mt-1">Standard procedure for converting the web instance to an offline desktop app.</p>
                </div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                  <i className="fas fa-desktop"></i>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">1</div>
                  <h4 className="font-bold text-slate-800">Access Portal</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Open the secure link on your customer's computer using Chrome or Edge.</p>
                  <button onClick={copyInstallLink} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    <i className="fas fa-copy"></i> Copy Link
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">2</div>
                  <h4 className="font-bold text-slate-800">Trigger Install</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Look for the <i className="fas fa-download mx-1"></i> icon in the browser address bar. Click <strong>"Install App"</strong>.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">3</div>
                  <h4 className="font-bold text-slate-800">Launch Native</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">The app will now appear on the <strong>Windows Start Menu</strong> or <strong>Mac Launchpad</strong>.</p>
                </div>
              </div>

              {!isStandalone && (
                <div className="mt-12 p-6 bg-blue-600 rounded-2xl text-white flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">Ready to Install on this PC?</h4>
                    <p className="text-xs text-blue-100 opacity-80">Click the icon in your browser's address bar now.</p>
                  </div>
                  <div className="text-4xl animate-pulse opacity-50">
                    <i className="fas fa-arrow-up"></i>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="max-w-4xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
           <h3 className="text-2xl font-bold text-slate-800 mb-6">Production Readiness Audit</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-emerald-500"></i>
                    <span className="font-bold text-slate-700">Company Name</span>
                 </div>
                 <span className="text-slate-400 font-mono text-sm">{profile.companyName}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-emerald-500"></i>
                    <span className="font-bold text-slate-700">GSTIN Verified</span>
                 </div>
                 <span className="text-slate-400 font-mono text-sm">{profile.gstin}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-emerald-500"></i>
                    <span className="font-bold text-slate-700">Offline PWA Cache</span>
                 </div>
                 <span className="text-emerald-600 font-bold text-sm">ENABLED</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-blue-200">
                 <div className="flex items-center gap-3">
                    <i className="fas fa-info-circle text-blue-500"></i>
                    <span className="font-bold text-slate-700">Deployment Link</span>
                 </div>
                 <span className="text-blue-600 font-bold text-sm cursor-pointer" onClick={copyInstallLink}>READY TO COPY</span>
              </div>
           </div>
           <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm">
              <p className="font-bold mb-2"><i className="fas fa-exclamation-triangle mr-2"></i>Important Note for Resellers</p>
              Once you deploy the URL, the "Whitelabeling" settings you have set here will be the **default** for any new user who opens your link. Ensure your client's details are entered correctly in 'Business Settings' before deployment.
           </div>
        </div>
      )}

      {activeTab === 'MAINTENANCE' && (
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mb-8">
                <i className="fas fa-file-export"></i>
             </div>
             <h3 className="text-2xl font-bold text-slate-800">Full System Backup</h3>
             <p className="text-slate-500 mt-3 text-sm leading-relaxed px-4">Generate a <strong>.raman</strong> file to transfer all settings, inventory, and project data.</p>
             <button onClick={exportFullDatabase} className="mt-10 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">Download .raman Package</button>
           </div>
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mb-8">
                <i className="fas fa-file-import"></i>
             </div>
             <h3 className="text-2xl font-bold text-slate-800">Restore/Import</h3>
             <p className="text-slate-500 mt-3 text-sm leading-relaxed px-4">Initialize a new installation by uploading a previous system backup file.</p>
             <input type="file" ref={fileInputRef} className="hidden" accept=".raman,.json" onChange={handleFileUpload} />
             <button onClick={() => fileInputRef.current?.click()} className="mt-10 w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 border border-slate-200 transition-all">Upload System File</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DesktopConfig;
