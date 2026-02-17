import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveFile, getFilePath } from '@/lib/storage';
import { extractTextFromImage, parseInvoiceText } from '@/lib/ocr/tesseract';
import { validateFile } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Save file
    const fileUrl = await saveFile(file);
    const filePath = getFilePath(fileUrl);
    
    // Extract text using OCR
    let extractedData;
    try {
      const text = await extractTextFromImage(filePath);
      extractedData = parseInvoiceText(text);
    } catch (error) {
      console.error('OCR processing error:', error);
      extractedData = {
        confidence: 0,
      };
    }
    
    // Create invoice in database with extracted data
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: extractedData.invoiceNumber || `INV-${Date.now()}`,
        vendor: extractedData.vendor || 'Unknown Vendor',
        amount: extractedData.amount || 0,
        currency: extractedData.currency || 'USD',
        invoiceDate: extractedData.invoiceDate 
          ? new Date(extractedData.invoiceDate)
          : new Date(),
        dueDate: extractedData.dueDate
          ? new Date(extractedData.dueDate)
          : null,
        fileUrl,
        extractedData: extractedData as any,
        status: 'PENDING',
        items: extractedData.items ? {
          create: extractedData.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process invoice' },
      { status: 500 }
    );
  }
}
