
import React, { useState, useEffect } from 'react';
import { getPurchases, getProjects } from '../store/db';
import { Purchase, Project } from '../types';

const Reports: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    setPurchases(getPurchases());
    setProjects(getProjects());
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const filteredPurchases = purchases.filter(p => new Date(p.date).getMonth() === month);
  const totalGstIn = filteredPurchases.reduce((acc, curr) => acc + curr.totalGst, 0);
  const totalSpending = filteredPurchases.reduce((acc, curr) => acc + curr.grandTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Business Reports</h2>
        <select 
          className="border p-2 rounded-lg bg-white text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
        >
          {monthNames.map((m, i) => <option key={i} value={i}>{m} 2024</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* GST Report Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
              <i className="fas fa-file-invoice"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">GST Summary ({monthNames[month]})</h3>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b pb-4">
              <span className="text-slate-500 font-medium">Input Tax Credit (ITC)</span>
              <span className="text-2xl font-bold text-amber-600">₹{totalGstIn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end border-b pb-4">
              <span className="text-slate-500 font-medium">Taxable Purchase Value</span>
              <span className="text-xl font-bold text-slate-800">₹{(totalSpending - totalGstIn).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-xs text-amber-800 leading-relaxed shadow-inner">
              <i className="fas fa-circle-info mr-2"></i>
              Based on your purchase entries for this month, you have accumulated ₹{totalGstIn.toLocaleString()} in GST credits which can be offset against your project billing liabilities.
            </div>
          </div>
        </div>

        {/* Project Budget Efficiency */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Budget Performance</h3>
          </div>

          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-slate-400 italic py-12 text-center">No projects registered yet.</p>
            ) : (
              projects.map(p => {
                const spent = p.materialsUsed.reduce((acc, m) => acc + m.cost, 0);
                const ratio = (spent / p.budget) * 100;
                return (
                  <div key={p.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-700">{p.name}</span>
                      <span className={ratio > 90 ? 'text-red-600 font-bold' : 'text-slate-500'}>{ratio.toFixed(1)}% used</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${ratio > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${Math.min(ratio, 100)}%`}}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-100 text-slate-800 p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900">Need detailed PDF reports?</h4>
          <p className="text-sm text-slate-500 font-medium">Phase 2 will include specialized Excel/PDF export capabilities for accountants.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-400 px-6 py-2 rounded-xl font-bold cursor-not-allowed shadow-sm">Coming Soon</button>
      </div>
    </div>
  );
};

export default Reports;
