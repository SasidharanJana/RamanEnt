
import React, { useState } from 'react';

const Monetization: React.FC = () => {
  const [estCustomers, setEstCustomers] = useState(10);
  const [showDeploymentHub, setShowDeploymentHub] = useState(true);
  
  // Basic SaaS Cost Logic
  const infraFixed = 45; 
  const variablePerUser = 0.50; 
  const totalCost = infraFixed + (estCustomers * variablePerUser);
  const revenue = estCustomers * 15; 
  const profit = revenue - totalCost;

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Monetization & Deployment</h2>
          <p className="text-slate-500 mt-1">From free deployment to scaling your profits.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setShowDeploymentHub(true)}
             className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${showDeploymentHub ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
           >
             Phase 2: Deploy Now
           </button>
           <button 
             onClick={() => setShowDeploymentHub(false)}
             className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${!showDeploymentHub ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
           >
             Phase 3: SaaS Math
           </button>
        </div>
      </header>

      {showDeploymentHub ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
            <h3 className="text-2xl font-bold mb-4">Phase 2: Deployment Hub (₹0 Costs)</h3>
            <p className="text-blue-100 mb-8 max-w-2xl">
              To sell this to clients, you need to host it on a public URL. 
              Below are the two best ways to deploy this today for <strong>completely free</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white text-blue-700 w-10 h-10 rounded-xl flex items-center justify-center font-black">V</div>
                  <h4 className="font-bold">Deploy on Vercel</h4>
                </div>
                <ul className="text-xs space-y-2 text-blue-50">
                  <li>1. Visit <strong>vercel.com</strong> & create account.</li>
                  <li>2. Install Vercel CLI or Connect GitHub.</li>
                  <li>3. Drag and drop this project folder.</li>
                  <li>4. Get your <strong>.vercel.app</strong> URL instantly.</li>
                </ul>
                <button className="mt-6 w-full py-2 bg-white text-blue-700 rounded-lg text-xs font-bold">Go to Vercel</button>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white text-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">NET</div>
                  <h4 className="font-bold">Deploy on Netlify</h4>
                </div>
                <ul className="text-xs space-y-2 text-blue-50">
                  <li>1. Visit <strong>app.netlify.com</strong>.</li>
                  <li>2. Use "Deploy Manually" option.</li>
                  <li>3. Zip your files and upload them.</li>
                  <li>4. Set up a custom domain (optional).</li>
                </ul>
                <button className="mt-6 w-full py-2 bg-white text-indigo-700 rounded-lg text-xs font-bold">Go to Netlify</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
             <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
               <i className="fas fa-globe"></i>
             </div>
             <div>
               <h4 className="font-bold text-slate-800">Commercial Tip: Use a Branded Domain</h4>
               <p className="text-sm text-slate-500 mt-1">
                 Instead of <code>my-app.vercel.app</code>, buy <code>manager.ramanenterprises.in</code> for ₹800/year. 
                 A professional domain allows you to charge 5x more for your setup fee.
               </p>
             </div>
          </div>
        </div>
      ) : (
        /* SaaS Cost Calculator */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-8 bg-slate-900 text-white">
              <h3 className="text-xl font-bold mb-2">Cloud Profit Estimator (Phase 3)</h3>
              <p className="text-slate-400 text-sm">See how your business scales when you move from Desktop to Cloud.</p>
            </div>
            
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Target Customers</label>
                  <input 
                    type="range" min="1" max="500" value={estCustomers} 
                    onChange={(e) => setEstCustomers(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
                    <span>1 Client</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{estCustomers} Clients</span>
                    <span>500 Clients</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-600">Infrastructure (DB + Hosting)</span>
                    <span className="font-mono font-bold">$45.00/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-600">AI & Storage Cost (Est.)</span>
                    <span className="font-mono font-bold">${(estCustomers * variablePerUser).toFixed(2)}/mo</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="font-bold text-slate-800">Total Monthly Expense</span>
                    <span className="text-xl font-bold text-red-600 font-mono">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">
                  <i className="fas fa-chart-line"></i>
                </div>
                <p className="text-blue-100 uppercase tracking-widest text-xs font-bold">Estimated Monthly Profit</p>
                <h4 className="text-5xl font-bold mt-2 font-mono">
                  ${profit.toLocaleString()}
                </h4>
                <p className="text-blue-200 text-sm mt-4 text-center">Based on a subscription of $15 (₹1,250) per customer/month.</p>
                <div className="mt-8 px-6 py-2 bg-white/20 rounded-full border border-white/30 text-xs font-bold">
                  ROI: {((profit/totalCost)*100).toFixed(0)}% Margin
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monetization;
