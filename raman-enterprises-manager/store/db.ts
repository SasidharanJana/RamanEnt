
import { Product, Purchase, Project, ProjectStatus, BusinessProfile } from '../types';

const KEYS = {
  PRODUCTS: 'raman_products',
  PURCHASES: 'raman_purchases',
  PROJECTS: 'raman_projects',
  PROFILE: 'raman_business_profile'
};

const DEFAULT_PROFILE: BusinessProfile = {
  companyName: 'Raman Enterprises',
  ownerName: 'Admin',
  gstin: '07AAAAA0000A1Z5',
  address: 'New Delhi, India',
  logoColor: '#2563eb',
  currency: '₹'
};

export const isAppEmpty = (): boolean => {
  const products = getProducts();
  const projects = getProjects();
  return products.length === 0 && projects.length === 0;
};

export const getBusinessProfile = (): BusinessProfile => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : DEFAULT_PROFILE;
};

export const saveBusinessProfile = (profile: BusinessProfile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getPurchases = (): Purchase[] => {
  const data = localStorage.getItem(KEYS.PURCHASES);
  return data ? JSON.parse(data) : [];
};

export const savePurchase = (purchase: Purchase) => {
  const purchases = getPurchases();
  purchases.push(purchase);
  localStorage.setItem(KEYS.PURCHASES, JSON.stringify(purchases));

  const products = getProducts();
  purchase.items.forEach(item => {
    const idx = products.findIndex(p => p.id === item.productId);
    if (idx > -1) {
      const oldVal = products[idx].currentStock * products[idx].avgRate;
      const newVal = item.quantity * item.rate;
      products[idx].currentStock += item.quantity;
      products[idx].avgRate = (oldVal + newVal) / products[idx].currentStock;
    } else {
      products.push({
        id: item.productId,
        name: item.productName,
        category: 'General',
        unit: 'Unit',
        currentStock: item.quantity,
        minStock: 10,
        avgRate: item.rate
      });
    }
  });
  saveProducts(products);
};

export const getProjects = (): Project[] => {
  const data = localStorage.getItem(KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
};

export const saveProject = (project: Project) => {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx > -1) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
};

export const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx > -1) {
    projects[idx].status = status;
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  }
  return false;
};

export const useMaterialInProject = (projectId: string, productId: string, qty: number) => {
  const projects = getProjects();
  const products = getProducts();
  
  const projIdx = projects.findIndex(p => p.id === projectId);
  const prodIdx = products.findIndex(p => p.id === productId);

  if (projIdx > -1 && prodIdx > -1 && products[prodIdx].currentStock >= qty) {
    const cost = qty * products[prodIdx].avgRate;
    const existingMaterial = projects[projIdx].materialsUsed.find(m => m.productId === productId);
    if (existingMaterial) {
      existingMaterial.quantity += qty;
      existingMaterial.cost += cost;
    } else {
      projects[projIdx].materialsUsed.push({
        productId,
        productName: products[prodIdx].name,
        quantity: qty,
        cost
      });
    }
    products[prodIdx].currentStock -= qty;
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    saveProducts(products);
    return true;
  }
  return false;
};

export const exportFullDatabase = () => {
  const data = {
    profile: getBusinessProfile(),
    products: getProducts(),
    projects: getProjects(),
    purchases: getPurchases(),
    exportedAt: new Date().toISOString(),
    version: '2.0.0-WhiteLabel'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = data.profile.companyName.replace(/\s+/g, '_');
  a.download = `${fileName}_Backup.raman`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDatabase = (jsonString: string) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.products && data.projects && data.purchases) {
      if (data.profile) localStorage.setItem(KEYS.PROFILE, JSON.stringify(data.profile));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(data.products));
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
      localStorage.setItem(KEYS.PURCHASES, JSON.stringify(data.purchases));
      window.location.reload();
      return true;
    }
  } catch (e) {
    console.error("Import failed", e);
  }
  return false;
};

export const seedSampleData = () => {
  const sampleProducts: Product[] = [
    { id: 'PROD-1', name: 'Copper Wire 2.5mm', category: 'Electrical', unit: 'Mtr', currentStock: 500, minStock: 100, avgRate: 45 },
    { id: 'PROD-2', name: 'Bitumen Grade 60/70', category: 'Road', unit: 'Drum', currentStock: 25, minStock: 5, avgRate: 12500 },
    { id: 'PROD-3', name: 'Circuit Breaker 32A', category: 'Electrical', unit: 'Pcs', currentStock: 150, minStock: 20, avgRate: 850 }
  ];
  const sampleProjects: Project[] = [
    { id: 'PROJ-1', name: 'Smart City Lighting', client: 'Govt. Dept', type: 'Electrical', status: ProjectStatus.IN_PROGRESS, startDate: '2024-01-15', budget: 500000, materialsUsed: [] },
    { id: 'PROJ-2', name: 'NH-44 Patch Work', client: 'PWD India', type: 'Road', status: ProjectStatus.PLANNING, startDate: '2024-03-01', budget: 1200000, materialsUsed: [] }
  ];
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(sampleProducts));
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(sampleProjects));
  localStorage.setItem(KEYS.PURCHASES, JSON.stringify([]));
  window.location.reload();
};
