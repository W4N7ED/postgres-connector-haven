
// Types pour les modèles Prisma

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  apiKeys?: ApiKey[];
  contacts?: Contact[];
  quotes?: Quote[];
  invoices?: Invoice[];
}

export type Role = 'ADMIN' | 'USER' | 'CLIENT';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'CLIENT' | 'SUPPLIER' | 'PARTNER';
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
  quotes?: Quote[];
  invoices?: Invoice[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  category?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  quoteItems?: QuoteItem[];
  invoiceItems?: InvoiceItem[];
}

export interface Quote {
  id: string;
  contactId: string;
  contact?: Contact;
  date: Date;
  dueDate?: Date;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  total: number;
  notes?: string;
  items?: QuoteItem[];
  invoice?: Invoice;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  quote?: Quote;
  productId: string;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface Invoice {
  id: string;
  contactId: string;
  contact?: Contact;
  quoteId?: string;
  quote?: Quote;
  date: Date;
  dueDate: Date;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELED';
  total: number;
  notes?: string;
  items?: InvoiceItem[];
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  productId: string;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  amount: number;
  date: Date;
  method: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'PAYPAL' | 'OTHER';
  reference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  key: string;
  description?: string;
  userId: string;
  user?: User;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Integration {
  id: string;
  type: 'STORAGE' | 'CRM' | 'PAYMENT_GATEWAY' | 'EMAIL' | 'OTHER';
  service: string;
  credentials: any; // Stocké en format JSON
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les requêtes d'API
export interface PostgresQueryRequest {
  query: string;
  params?: any[];
  connectionId?: string;
}
