import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rejectionSchema } from '@/lib/validation';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const validation = rejectionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }
    
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: validation.data.reason,
      },
      include: {
        items: true,
      },
    });
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Reject invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to reject invoice' },
      { status: 500 }
    );
  }
}
