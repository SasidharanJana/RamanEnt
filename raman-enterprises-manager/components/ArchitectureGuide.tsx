
import React from 'react';

const ArchitectureGuide: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Raman Enterprises Manager - Roadmap</h1>
        <p className="text-slate-500 mt-2">Technical path from Local Tool to Global SaaS.</p>
      </header>

      {/* Logic Flow Diagram */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <i className="fas fa-project-diagram text-blue-600"></i>
          Phase 3 Architecture (Cloud)
        </h2>
        <div className="font-mono text-sm bg-slate-900 text-blue-300 border border-slate-800 p-6 rounded-lg whitespace-pre leading-relaxed shadow-inner overflow-x-auto">
{`[ BROWSER / MOBILE APP ]  <--- Frontend (Current Code)
      |
      | (Secure Auth Tokens)
      V
[ API GATEWAY / MIDDLEWARE ] <--- Node.js or Edge Functions
      |
      | (SQL Queries)
      V
[ CLOUD DATABASE ] <--- Supabase / PostgreSQL
      |
      +---> Tenant A (Customer 1 Data)
      |
      +---> Tenant B (Customer 2 Data)`}
        </div>
      </section>

      {/* Phase 3 Upgrade Checklist */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Cloud Transition Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-800 text-sm uppercase mb-1">1. Authentication</h4>
              <p className="text-xs text-slate-600">Implement Google/Email login. This allows users to access their inventory from any device, not just the one it was installed on.</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <h4 className="font-bold text-emerald-800 text-sm uppercase mb-1">2. Data Persistence</h4>
              <p className="text-xs text-slate-600">Replace "localStorage" with real-time SQL calls. This ensures data is synced instantly between the office and the job site.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <h4 className="font-bold text-purple-800 text-sm uppercase mb-1">3. Multi-Tenancy</h4>
              <p className="text-xs text-slate-600">Add a "CompanyID" to every table. This keeps Customer A's road construction data strictly invisible to Customer B.</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h4 className="font-bold text-amber-800 text-sm uppercase mb-1">4. Payment Hooks</h4>
              <p className="text-xs text-slate-600">Integrate Stripe or Razorpay. Automatically lock the app if a customer's monthly subscription payment fails.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Path */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <span className="text-xs font-bold text-blue-600 uppercase">Phase 1</span>
          <h3 className="text-lg font-bold mt-1">Personal Use</h3>
          <p className="mt-2 text-xs text-slate-500">Free, Local, Offline. Best for internal operations.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase">Phase 2</span>
          <h3 className="text-lg font-bold mt-1">Whitelabeling</h3>
          <p className="mt-2 text-xs text-slate-500">Current build. Sell as a branded local setup fee ($500+).</p>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm relative ring-4 ring-purple-100">
          <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">THE GOAL</div>
          <span className="text-xs font-bold text-purple-600 uppercase">Phase 3</span>
          <h3 className="text-lg font-bold mt-1">Global SaaS</h3>
          <p className="mt-2 text-xs text-slate-500">Recurring Revenue. Zero-touch delivery. Infinite scale.</p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureGuide;
