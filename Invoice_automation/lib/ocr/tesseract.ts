import Tesseract from 'tesseract.js';
import { ExtractedInvoiceData } from '@/lib/types';

export async function extractTextFromImage(imagePath: string): Promise<string> {
  try {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}

export function parseInvoiceText(text: string): ExtractedInvoiceData {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  const invoiceData: ExtractedInvoiceData = {
    confidence: 0.7,
  };
  
  // Extract invoice number
  const invoiceNumberMatch = text.match(/(?:Invoice|INV|#)\s*(?:Number|No\.?|#)?\s*:?\s*([A-Z0-9-]+)/i);
  if (invoiceNumberMatch) {
    invoiceData.invoiceNumber = invoiceNumberMatch[1];
  }
  
  // Extract vendor/company name (usually at the top)
  const vendorMatch = lines[0];
  if (vendorMatch && vendorMatch.length > 2) {
    invoiceData.vendor = vendorMatch.trim();
  }
  
  // Extract date
  const dateMatch = text.match(/(?:Date|Dated?)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  if (dateMatch) {
    invoiceData.invoiceDate = dateMatch[1];
  }
  
  // Extract due date
  const dueDateMatch = text.match(/(?:Due\s*Date|Payment\s*Due)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  if (dueDateMatch) {
    invoiceData.dueDate = dueDateMatch[1];
  }
  
  // Extract total amount
  const amountMatch = text.match(/(?:Total|Amount\s*Due|Grand\s*Total)\s*:?\s*\$?\s*([\d,]+\.?\d*)/i);
  if (amountMatch) {
    invoiceData.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }
  
  // Extract currency
  if (text.includes('$') || text.toLowerCase().includes('usd')) {
    invoiceData.currency = 'USD';
  } else if (text.includes('€') || text.toLowerCase().includes('eur')) {
    invoiceData.currency = 'EUR';
  } else if (text.includes('£') || text.toLowerCase().includes('gbp')) {
    invoiceData.currency = 'GBP';
  }
  
  // Extract line items (simplified)
  const items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }> = [];
  
  // Look for patterns like: Item  Qty  Price  Total
  const itemRegex = /(.+?)\s+(\d+)\s+\$?([\d,]+\.?\d*)\s+\$?([\d,]+\.?\d*)/g;
  let match;
  
  while ((match = itemRegex.exec(text)) !== null) {
    items.push({
      description: match[1].trim(),
      quantity: parseInt(match[2]),
      unitPrice: parseFloat(match[3].replace(/,/g, '')),
      total: parseFloat(match[4].replace(/,/g, '')),
    });
  }
  
  if (items.length > 0) {
    invoiceData.items = items;
  }
  
  return invoiceData;
}
