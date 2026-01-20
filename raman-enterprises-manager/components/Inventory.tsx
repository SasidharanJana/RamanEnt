
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, saveProducts } from '../store/db';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electrical',
    unit: 'No.s',
    minStock: 10
  });

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleAddProduct = () => {
    const product: Product = {
      id: `PROD-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      unit: newProduct.unit,
      currentStock: 0,
      minStock: newProduct.minStock,
      avgRate: 0
    };
    const updated = [...products, product];
    setProducts(updated);
    saveProducts(updated);
    setShowAdd(false);
    setNewProduct({ name: '', category: 'Electrical', unit: 'No.s', minStock: 10 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <i className="fas fa-plus"></i> New Item
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-4 text-blue-800">Register New Inventory Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
              placeholder="Item Name (e.g. Copper Wire)"
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
            <select 
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
              value={newProduct.category}
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            >
              <option>Electrical</option>
              <option>Road Construction</option>
              <option>Safety Gear</option>
              <option>Tools</option>
            </select>
            <input 
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
              placeholder="Unit (Kg, Mtr, No.s)"
              value={newProduct.unit}
              onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
            />
            <input 
              type="number"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
              placeholder="Min. Alert Stock"
              value={newProduct.minStock}
              onChange={e => setNewProduct({...newProduct, minStock: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="flex justify-end mt-4 gap-3">
            <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
            <button onClick={handleAddProduct} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Save Item</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Item Details</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-center">Stock</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-center">Min Alert</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Avg Rate (₹)</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.id}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{p.category}</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-medium">{p.currentStock}</span> {p.unit}
                </td>
                <td className="px-6 py-4 text-center text-slate-500">{p.minStock}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">₹{p.avgRate.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  {p.currentStock <= p.minStock ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold animate-pulse">Low Stock</span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No inventory items found. Add some to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
