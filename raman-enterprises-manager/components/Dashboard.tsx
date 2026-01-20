
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getProducts, getProjects, getPurchases, seedSampleData, isAppEmpty } from '../store/db';
import { Product, Project, Purchase } from '../types';
import { getBusinessInsights } from '../services/aiService';

const Dashboard: React.FC = () => {
  const [data, setData] = useState({
    products: [] as Product[],
    projects: [] as Project[],
    purchases: [] as Purchase[]
  });
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isEmpty, setIsEmpty] = useState(isAppEmpty());

  useEffect(() => {
    setData({
      products: getProducts(),
      projects: getProjects(),
      purchases: getPurchases()
    });
    setIsEmpty(isAppEmpty());
  }, []);

  const generateInsights = async () => {
    setLoadingInsights(true);
    const result = await getBusinessInsights(data.products, data.projects, data.purchases);
    setInsights(result);
    setLoadingInsights(false);
  };

  const stats = [
    { label: 'Active Projects', value: data.projects.filter(p => p.status === 'In Progress').length, icon: 'fa-rocket', color: 'bg-blue-600' },
    { label: 'Total Inventory Value', value: `₹${data.products.reduce((acc, p) => acc + (p.currentStock * p.avgRate), 0).toLocaleString()}`, icon: 'fa-boxes-stacked', color: 'bg-emerald-600' },
    { label: 'GST Input Credit (Est.)', value: `₹${data.purchases.reduce((acc, p) => acc + p.totalGst, 0).toLocaleString()}`, icon: 'fa-building-columns', color: 'bg-amber-600' },
    { label: 'Low Stock Alerts', value: data.products.filter(p => p.currentStock <= p.minStock).length, icon: 'fa-triangle-exclamation', color: 'bg-red-600' },
  ];

  const chartData = data.products.length > 0 
    ? data.products.slice(0, 6).map(p => ({ name: p.name, stock: p.currentStock, min: p.minStock }))
    : [{ name: 'No Data', stock: 0, min: 0 }];

  if (isEmpty) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-xl shadow-blue-100/50">
          <i className="fas fa-layer-group"></i>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Initialization</h2>
        <p className="text-slate-500 mt-4 max-w-md text-lg leading-relaxed">
          The database is currently empty. This is standard for new deployments. How would you like to start?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
          <button 
            onClick={seedSampleData}
            className="p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-blue-500 hover:shadow-xl transition-all group text-left"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <i className="fas fa-magic"></i>
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Load Industry Samples</h4>
            <p className="text-sm text-slate-500 mt-1">Pre-load Electrical & Road construction items to see how the system works.</p>
          </button>
          
          <button 
            onClick={() => window.location.hash = '#/desktop-dist'} 
            className="p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-emerald-500 hover:shadow-xl transition-all group text-left"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <i className="fas fa-file-import"></i>
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Restore from Backup</h4>
            <p className="text-sm text-slate-500 mt-1">Upload a <code>.raman</code> file to restore your existing products and project history.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Business Overview</h1>
          <p className="text-slate-500">Managing assets for your enterprise suite.</p>
        </div>
        <div className="flex gap-2">
          <div className="text-sm font-medium text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm flex items-center">
            Offline Mode Active
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">{s.value}</h3>
              </div>
              <div className={`${s.color} text-white p-3 rounded-xl shadow-lg shadow-opacity-20`}>
                <i className={`fas ${s.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-slate-800">Key Inventory Levels</h3>
            <span className="text-xs text-slate-400">Top 6 Items</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stock <= entry.min ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 text-slate-900 border border-blue-100 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <i className="fas fa-brain"></i>
              </div>
              <h3 className="font-bold text-lg text-blue-900">AI Business Advisor</h3>
            </div>
            
            <div className="flex-grow">
              {insights ? (
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {insights}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                   <p className="text-slate-500 text-sm">Need a quick business analysis?</p>
                   <button 
                    onClick={generateInsights}
                    disabled={loadingInsights}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md"
                   >
                    {loadingInsights ? (
                      <i className="fas fa-circle-notch animate-spin"></i>
                    ) : (
                      <i className="fas fa-wand-magic-sparkles"></i>
                    )}
                    Generate Insights
                   </button>
                </div>
              )}
            </div>

            {insights && (
              <button 
                onClick={() => setInsights(null)}
                className="mt-6 text-xs text-blue-500 hover:text-blue-700 font-bold self-start uppercase tracking-wider"
              >
                Reset Insights
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
