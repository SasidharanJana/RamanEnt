
import React, { useState, useEffect } from 'react';
import { Product, Purchase, PurchaseItem, BusinessProfile } from '../types';
import { getProducts, getPurchases, savePurchase, getBusinessProfile } from '../store/db';

const Purchases: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [profile, setProfile] = useState<BusinessProfile>(getBusinessProfile());
  const [showNew, setShowNew] = useState(false);
  
  const [vendor, setVendor] = useState('');
  const [cart, setCart] = useState<PurchaseItem[]>([]);
  const [selectedProd, setSelectedProd] = useState('');
  const [qty, setQty] = useState(0);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    setProducts(getProducts());
    setPurchases(getPurchases());
    setProfile(getBusinessProfile());
  }, []);

  const handlePrint = (p: Purchase) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Invoice - ${p.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid ${profile.logoColor}; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: ${profile.logoColor}; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #eee; }
            td { border-bottom: 1px solid #eee; padding: 12px; }
            .total { text-align: right; margin-top: 30px; font-size: 1.2em; font-weight: bold; color: ${profile.logoColor}; }
            .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="company-name">${profile.companyName}</h1>
              <p>${profile.address}</p>
              <p>GSTIN: ${profile.gstin}</p>
            </div>
            <div style="text-align: right">
              <h2>PURCHASE RECORD</h2>
              <p>ID: ${p.id}</p>
              <p>Date: ${p.date}</p>
            </div>
          </div>
          <h3>Vendor: ${p.vendorName}</h3>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Rate</th><th>GST (18%)</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${p.items.map(i => `
                <tr>
                  <td>${i.productName}</td>
                  <td>${i.quantity}</td>
                  <td>${profile.currency}${i.rate.toFixed(2)}</td>
                  <td>${profile.currency}${i.gstAmount.toFixed(2)}</td>
                  <td>${profile.currency}${i.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">GRAND TOTAL: ${profile.currency}${p.grandTotal.toLocaleString()}</div>
          <div class="footer">This is a computer-generated record for ${profile.companyName}. Valid without signature.</div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const addToCart = () => {
    const prod = products.find(p => p.id === selectedProd);
    if (!prod) return;

    const sub = qty * rate;
    const gst = sub * 0.18;
    
    const newItem: PurchaseItem = {
      productId: prod.id,
      productName: prod.name,
      quantity: qty,
      rate,
      gstPercent: 18,
      gstAmount: gst,
      total: sub + gst
    };

    setCart([...cart, newItem]);
    setQty(0);
    setRate(0);
  };

  const handleSavePurchase = () => {
    if (!vendor || cart.length === 0) return;
    const subTotal = cart.reduce((acc, curr) => acc + (curr.quantity * curr.rate), 0);
    const totalGst = cart.reduce((acc, curr) => acc + curr.gstAmount, 0);
    const purchase: Purchase = {
      id: `PUR-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      vendorName: vendor,
      items: cart,
      subTotal,
      totalGst,
      grandTotal: subTotal + totalGst
    };
    savePurchase(purchase);
    setPurchases([...getPurchases()]);
    setShowNew(false);
    setCart([]);
    setVendor('');
    setProducts(getProducts());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Purchases & GST In</h2>
        <button 
          onClick={() => setShowNew(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <i className="fas fa-file-invoice-dollar"></i> New Purchase
        </button>
      </div>

      {showNew && (
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-1">Vendor Name</label>
            <input 
              className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              placeholder="e.g. Agarwal Steel Corp"
              value={vendor}
              onChange={e => setVendor(e.target.value)}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-slate-700 mb-3">Add Items to Purchase</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Select Product</label>
                <select 
                  className="w-full border p-2 rounded text-sm outline-none bg-white text-slate-900"
                  value={selectedProd}
                  onChange={e => setSelectedProd(e.target.value)}
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Quantity</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded text-sm outline-none bg-white text-slate-900"
                  value={qty}
                  onChange={e => setQty(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Rate (Base)</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded text-sm outline-none font-mono bg-white text-slate-900"
                  value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                />
              </div>
              <button 
                onClick={addToCart}
                className="bg-slate-700 text-white px-4 py-2 rounded h-[38px] hover:bg-slate-800"
              >
                Add Row
              </button>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="mb-6 overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">GST (18%)</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 font-medium">{item.productName}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right font-mono text-slate-700">{profile.currency}{item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right text-emerald-600 font-mono">{profile.currency}{item.gstAmount.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold font-mono text-slate-800">{profile.currency}{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <div className="text-slate-600">
              <p>Items in Cart: <span className="font-bold">{cart.length}</span></p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setShowNew(false)} className="text-slate-500 font-medium hover:text-slate-700 transition-colors">Discard</button>
               <button onClick={handleSavePurchase} className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-emerald-700">Complete Purchase</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b font-bold text-slate-700">Recent Purchase History</div>
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Purchase ID</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Vendor</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Items</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Grand Total</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {purchases.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{p.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{p.vendorName}</td>
                <td className="px-6 py-4 text-slate-500">{p.items.length} materials</td>
                <td className="px-6 py-4 text-right font-bold text-emerald-700">{profile.currency}{p.grandTotal.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handlePrint(p)}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                    title="Print Invoice"
                  >
                    <i className="fas fa-print"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;
