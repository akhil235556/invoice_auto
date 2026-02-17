'use client';

import { useState } from 'react';
import { InvoiceWithItems } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface InvoiceDetailProps {
  invoice: InvoiceWithItems;
}

export function InvoiceDetail({ invoice: initialInvoice }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const router = useRouter();
  
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setInvoice(updated);
      }
    } catch (error) {
      console.error('Failed to approve invoice:', error);
    } finally {
      setIsApproving(false);
    }
  };
  
  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    
    setIsRejecting(true);
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setInvoice(updated);
        setShowRejectDialog(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject invoice:', error);
    } finally {
      setIsRejecting(false);
    }
  };
  
  const isPending = invoice.status === 'PENDING';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice {invoice.invoiceNumber}
          </h1>
          <div className="mt-2">
            <StatusBadge status={invoice.status} />
          </div>
        </div>
        
        {isPending && (
          <div className="flex gap-2">
            <Button
              variant="success"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowRejectDialog(true)}
            >
              Reject
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Vendor</dt>
                <dd className="text-sm text-gray-900">{invoice.vendor}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="text-sm text-gray-900">
                  {invoice.currency} {invoice.amount.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Invoice Date</dt>
                <dd className="text-sm text-gray-900">
                  {format(new Date(invoice.invoiceDate), 'MMMM dd, yyyy')}
                </dd>
              </div>
              {invoice.dueDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="text-sm text-gray-900">
                    {format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approval Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {invoice.approvedBy && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Approved By</dt>
                    <dd className="text-sm text-gray-900">{invoice.approvedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Approved At</dt>
                    <dd className="text-sm text-gray-900">
                      {invoice.approvedAt && format(new Date(invoice.approvedAt), 'MMMM dd, yyyy HH:mm')}
                    </dd>
                  </div>
                </>
              )}
              {invoice.rejectionReason && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
                  <dd className="text-sm text-gray-900">{invoice.rejectionReason}</dd>
                </div>
              )}
              {invoice.notes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="text-sm text-gray-900">{invoice.notes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
      
      {invoice.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {invoice.currency} {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {invoice.currency} {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice Document</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={invoice.fileUrl}
            alt="Invoice"
            className="max-w-full h-auto border border-gray-300 rounded"
          />
        </CardContent>
      </Card>
      
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Reject Invoice</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this invoice:
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={isRejecting || !rejectionReason.trim()}
              >
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
