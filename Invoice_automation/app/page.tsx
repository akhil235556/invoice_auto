'use client';

import { useEffect, useState } from 'react';
import { InvoiceUpload } from '@/components/invoices/InvoiceUpload';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InvoiceWithItems, InvoiceStatus } from '@/lib/types';

export default function HomePage() {
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const url = filter === 'ALL' 
        ? '/api/invoices' 
        : `/api/invoices?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvoices();
  }, [filter]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Automation System
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceUpload onUploadSuccess={fetchInvoices} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoices</CardTitle>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('ALL')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      filter === 'ALL'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('PENDING')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      filter === 'PENDING'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('APPROVED')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      filter === 'APPROVED'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setFilter('REJECTED')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      filter === 'REJECTED'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <InvoiceList invoices={invoices} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
