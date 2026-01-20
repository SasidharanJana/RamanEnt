
export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold'
}

export interface BusinessProfile {
  companyName: string;
  ownerName: string;
  gstin: string;
  address: string;
  logoColor: string;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  avgRate: number;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

export interface Purchase {
  id: string;
  date: string;
  vendorName: string;
  items: PurchaseItem[];
  subTotal: number;
  totalGst: number;
  grandTotal: number;
}

export interface ProjectMaterialUsage {
  productId: string;
  productName: string;
  quantity: number;
  cost: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  type: 'Electrical' | 'Road';
  status: ProjectStatus;
  startDate: string;
  budget: number;
  materialsUsed: ProjectMaterialUsage[];
}

export type ViewType = 'DASHBOARD' | 'INVENTORY' | 'PURCHASES' | 'PROJECTS' | 'REPORTS' | 'DESKTOP_CONFIG' | 'BUSINESS_SETTINGS' | 'MONETIZATION';
