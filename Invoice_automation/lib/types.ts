import { Invoice, InvoiceItem, InvoiceStatus } from '@prisma/client';

export type { Invoice, InvoiceItem, InvoiceStatus };

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export interface ExtractedInvoiceData {
  invoiceNumber?: string;
  vendor?: string;
  amount?: number;
  currency?: string;
  invoiceDate?: string;
  dueDate?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  confidence?: number;
}

export interface UploadResponse {
  success: boolean;
  invoice?: InvoiceWithItems;
  error?: string;
}
