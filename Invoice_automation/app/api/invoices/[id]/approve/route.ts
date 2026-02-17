import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: body.approvedBy || 'System',
        approvedAt: new Date(),
        notes: body.notes,
      },
      include: {
        items: true,
      },
    });
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Approve invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to approve invoice' },
      { status: 500 }
    );
  }
}
