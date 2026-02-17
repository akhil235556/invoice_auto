import { z } from 'zod';

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  invoiceDate: z.string().or(z.date()),
  dueDate: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
  total: z.number().positive('Total must be positive'),
});

export const updateInvoiceSchema = z.object({
  invoiceNumber: z.string().optional(),
  vendor: z.string().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  invoiceDate: z.string().or(z.date()).optional(),
  dueDate: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
});

export const approvalSchema = z.object({
  notes: z.string().optional(),
});

export const rejectionSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
});

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload an image (JPG, PNG, WebP) or PDF.',
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
    };
  }
  
  return { valid: true };
}
