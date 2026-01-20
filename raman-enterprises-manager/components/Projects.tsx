
import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, Product } from '../types';
import { getProjects, saveProject, getProducts, useMaterialInProject, updateProjectStatus } from '../store/db';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    client: '',
    type: 'Electrical' as const,
    budget: 0
  });

  const [usageForm, setUsageForm] = useState({
    productId: '',
    qty: 0
  });

  useEffect(() => {
    setProjects(getProjects());
    setProducts(getProducts());
  }, []);

  const handleCreateProject = () => {
    const newProj: Project = {
      id: `PROJ-${Date.now()}`,
      name: form.name,
      client: form.client,
      type: form.type,
      status: ProjectStatus.PLANNING,
      startDate: new Date().toISOString().split('T')[0],
      budget: form.budget,
      materialsUsed: []
    };
    saveProject(newProj);
    setProjects([...getProjects()]);
    setShowNew(false);
    setForm({ name: '', client: '', type: 'Electrical', budget: 0 });
  };

  const handleStatusChange = (projId: string, newStatus: ProjectStatus) => {
    if (updateProjectStatus(projId, newStatus)) {
      setProjects([...getProjects()]);
    }
  };

  const handleAddMaterial = (projId: string) => {
    if (useMaterialInProject(projId, usageForm.productId, usageForm.qty)) {
      setProjects([...getProjects()]);
      setProducts([...getProducts()]);
      setUsageForm({ productId: '', qty: 0 });
    } else {
      alert("Insufficient stock or invalid product!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Project / Work Tracker</h2>
        <button 
          onClick={() => setShowNew(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-folder-plus"></i> Initialize Project
        </button>
      </div>

      {showNew && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md">
          <h3 className="font-bold text-lg mb-4 text-indigo-900">New Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input 
              className="border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              placeholder="Project Name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <input 
              className="border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              placeholder="Client Name"
              value={form.client}
              onChange={e => setForm({...form, client: e.target.value})}
            />
            <select 
              className="border p-2 rounded outline-none bg-white text-slate-900"
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value as any})}
            >
              <option value="Electrical">Electrical Works</option>
              <option value="Road">Road Construction</option>
            </select>
            <input 
              type="number"
              className="border p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              placeholder="Total Budget (₹)"
              value={form.budget}
              onChange={e => setForm({...form, budget: Number(e.target.value)})}
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowNew(false)} className="text-slate-500 font-medium hover:text-slate-700 transition-colors">Cancel</button>
            <button onClick={handleCreateProject} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Start Project</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(proj => {
          const totalSpent = proj.materialsUsed.reduce((acc, m) => acc + m.cost, 0);
          const progress = (totalSpent / proj.budget) * 100;
          
          return (
            <div key={proj.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{proj.type}</span>
                  <h3 className="text-lg font-bold text-slate-800">{proj.name}</h3>
                  <p className="text-sm text-slate-500">Client: {proj.client}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    proj.status === ProjectStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 
                    proj.status === ProjectStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {proj.status}
                  </span>
                  {proj.status === ProjectStatus.PLANNING && (
                    <button 
                      onClick={() => handleStatusChange(proj.id, ProjectStatus.IN_PROGRESS)}
                      className="text-[9px] font-bold text-indigo-600 underline"
                    >
                      Start Project
                    </button>
                  )}
                  {proj.status === ProjectStatus.IN_PROGRESS && (
                    <button 
                      onClick={() => handleStatusChange(proj.id, ProjectStatus.COMPLETED)}
                      className="text-[9px] font-bold text-emerald-600 underline"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6 space-y-4 flex-grow">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Material Cost Consumption</span>
                  <span className="font-bold text-slate-800">₹{totalSpent.toLocaleString()} / ₹{proj.budget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${progress > 90 ? 'bg-red-500' : 'bg-indigo-600'}`} 
                    style={{width: `${Math.min(progress, 100)}%`}}
                  ></div>
                </div>

                <div className="pt-4 border-t">
                  <button 
                    onClick={() => setActiveProject(activeProject === proj.id ? null : proj.id)}
                    className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline disabled:opacity-50"
                    disabled={proj.status === ProjectStatus.COMPLETED}
                  >
                    {activeProject === proj.id ? 'Hide Material Usage' : 'Log Material Consumption'}
                    <i className={`fas fa-chevron-${activeProject === proj.id ? 'up' : 'down'} text-[10px]`}></i>
                  </button>
                  
                  {activeProject === proj.id && proj.status !== ProjectStatus.COMPLETED && (
                    <div className="mt-4 p-4 bg-indigo-50/50 rounded-lg space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-3">
                        <select 
                          className="text-xs border p-2 rounded bg-white text-slate-900"
                          value={usageForm.productId}
                          onChange={e => setUsageForm({...usageForm, productId: e.target.value})}
                        >
                          <option value="">Select Material</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.currentStock} in stock)</option>)}
                        </select>
                        <input 
                          type="number"
                          placeholder="Qty"
                          className="text-xs border p-2 rounded bg-white text-slate-900"
                          value={usageForm.qty}
                          onChange={e => setUsageForm({...usageForm, qty: Number(e.target.value)})}
                        />
                      </div>
                      <button 
                        onClick={() => handleAddMaterial(proj.id)}
                        className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded hover:bg-indigo-700 shadow-sm"
                      >
                        Deduct from Stock & Record
                      </button>

                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Logs</p>
                        {proj.materialsUsed.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No materials used yet.</p>
                        ) : (
                          <div className="space-y-1">
                            {proj.materialsUsed.map((m, i) => (
                              <div key={i} className="flex justify-between text-[11px] text-slate-600">
                                <span>{m.productName} (x{m.quantity})</span>
                                <span className="font-mono text-slate-800">₹{m.cost.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="col-span-2 py-20 text-center border-2 border-dashed rounded-2xl border-slate-200">
            <i className="fas fa-folder-open text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-400 font-medium">No projects started. Click 'Initialize Project' above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
