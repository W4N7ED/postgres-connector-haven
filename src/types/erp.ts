
// Types pour la gestion des utilisateurs
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Le '?' indique que c'est optionnel lors du retour de données
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'client' | 'staff';

// Types pour les contacts/clients
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: ContactType;
  company?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactType = 'client' | 'supplier' | 'partner' | 'lead';

// Types pour les produits
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  sku?: string;
  category?: string;
  taxRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les devis
export interface Quote {
  id: string;
  contactId: string;
  date: Date;
  expiryDate?: Date;
  items: QuoteItem[];
  status: QuoteStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

// Types pour les factures
export interface Invoice {
  id: string;
  quoteId?: string;
  contactId: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  balance: number;
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';

// Types pour les clés API
export interface ApiKey {
  id: string;
  key: string;
  description: string;
  userId: string;
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  permissions: string[];
}

// Types pour les intégrations
export interface Integration {
  id: string;
  type: IntegrationType;
  service: string;
  credentials: Record<string, any>;
  status: IntegrationStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IntegrationType = 'storage' | 'crm' | 'payment' | 'accounting' | 'email' | 'other';
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending';

// Types pour les réponses API génériques
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    count?: number;
  };
}
