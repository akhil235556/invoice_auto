import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateInvoiceSchema } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Fetch invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const validation = updateInvoiceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error },
        { status: 400 }
      );
    }
    
    const { items, ...invoiceData } = validation.data;
    
    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...invoiceData,
        invoiceDate: invoiceData.invoiceDate 
          ? new Date(invoiceData.invoiceDate)
          : undefined,
        dueDate: invoiceData.dueDate
          ? new Date(invoiceData.dueDate)
          : undefined,
      },
      include: {
        items: true,
      },
    });
    
    // Update items if provided
    if (items) {
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });
      
      await prisma.invoiceItem.createMany({
        data: items.map(item => ({
          ...item,
          invoiceId: id,
        })),
      });
    }
    
    const updatedInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
    
    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.invoice.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
