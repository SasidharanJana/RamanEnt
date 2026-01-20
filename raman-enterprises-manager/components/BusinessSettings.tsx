
import React, { useState, useEffect } from 'react';
import { getBusinessProfile, saveBusinessProfile } from '../store/db';
import { BusinessProfile } from '../types';

const BusinessSettings: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile>(getBusinessProfile());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    saveBusinessProfile(profile);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      window.location.reload(); // Refresh to update sidebar branding
    }, 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">White-Label Branding</h2>
        <p className="text-slate-500 mt-1">Configure your company identity for invoices and reports.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-id-card text-blue-600"></i>
            Company Profile
          </h3>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Display Name</label>
            <input 
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-slate-900"
              placeholder="Your Company Name"
              value={profile.companyName}
              onChange={e => setProfile({...profile, companyName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">GSTIN Number</label>
            <input 
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-slate-900"
              placeholder="e.g. 07AAAAA0000A1Z5"
              value={profile.gstin}
              onChange={e => setProfile({...profile, gstin: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Business Address</label>
            <input 
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-slate-900"
              placeholder="Full Address"
              value={profile.address}
              onChange={e => setProfile({...profile, address: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Currency Symbol</label>
            <input 
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-slate-900"
              placeholder="e.g. ₹ or $"
              value={profile.currency}
              onChange={e => setProfile({...profile, currency: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Brand Color</label>
            <div className="flex gap-4 items-center">
              <input 
                type="color"
                className="w-12 h-12 rounded-lg cursor-pointer border-none"
                value={profile.logoColor}
                onChange={e => setProfile({...profile, logoColor: e.target.value})}
              />
              <span className="text-xs text-slate-500 font-mono">{profile.logoColor}</span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500 max-w-sm">Changes here will reflect on all your printed invoices and system headers.</p>
          <button 
            onClick={handleSave}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              isSaved ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaved ? <i className="fas fa-check"></i> : <i className="fas fa-save"></i>}
            {isSaved ? 'Settings Applied' : 'Update White-Label'}
          </button>
        </div>
      </div>

      <div className="bg-blue-900 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="text-center md:text-left flex-grow">
          <h4 className="text-xl font-bold">Reseller License Active</h4>
          <p className="text-blue-200 mt-2 text-sm leading-relaxed">
            You are authorized to sell this product under your own brand. 
            All customer data remains local and encrypted on their devices.
          </p>
        </div>
        <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm">
           <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Monetization Ready</p>
           <p className="font-bold">v2.0-Commercial</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;
