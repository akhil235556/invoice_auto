import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import { notFound } from 'next/navigation';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });
  
  if (!invoice) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
          >
            ← Back to Invoices
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <InvoiceDetail invoice={invoice} />
      </main>
    </div>
  );
}
