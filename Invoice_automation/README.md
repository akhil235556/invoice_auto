# Invoice Automation System

A modern invoice automation MVP built with Next.js, TypeScript, Prisma, and Tesseract OCR.

## Features

- 📤 **Upload Invoices**: Drag-and-drop interface for uploading invoice images (JPG, PNG, WebP) or PDFs
- 🤖 **OCR Extraction**: Automatically extract invoice data using Tesseract.js OCR
- 📋 **Invoice Management**: View, filter, and manage invoices
- ✅ **Approval Workflow**: Approve or reject invoices with reasons
- 🔍 **Detail View**: View complete invoice information including line items
- 📊 **Status Tracking**: Track invoice status (Pending, Approved, Rejected, Ready for Payout)

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma ORM)
- **OCR**: Tesseract.js
- **File Upload**: react-dropzone
- **Validation**: Zod
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invoice-automation
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Create uploads directory:
```bash
mkdir -p public/uploads
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Uploading an Invoice

1. On the home page, drag and drop an invoice image or PDF into the upload area
2. The system will automatically process the invoice using OCR
3. Extracted data will be saved to the database
4. The invoice will appear in the invoice list with "Pending" status

### Managing Invoices

- Use the filter buttons to view invoices by status (All, Pending, Approved, Rejected)
- Click "View Details" to see complete invoice information
- View extracted line items, amounts, dates, and vendor information

### Approving/Rejecting Invoices

1. Click on an invoice to view its details
2. For pending invoices, use the "Approve" or "Reject" buttons
3. When rejecting, provide a reason for the rejection
4. Approved/rejected invoices will update their status immediately

## Project Structure

```
├── app/
│   ├── api/
│   │   └── invoices/         # API routes
│   ├── invoices/              # Invoice detail pages
│   └── page.tsx               # Home page
├── components/
│   ├── invoices/              # Invoice-specific components
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── ocr/                   # OCR service
│   ├── prisma.ts              # Prisma client
│   ├── storage.ts             # File storage
│   ├── types.ts               # TypeScript types
│   └── validation.ts          # Validation schemas
├── prisma/
│   └── schema.prisma          # Database schema
└── public/
    └── uploads/               # Uploaded invoice files
```

## API Endpoints

- `POST /api/invoices/upload` - Upload and process an invoice
- `GET /api/invoices` - List all invoices (supports filtering)
- `GET /api/invoices/[id]` - Get a specific invoice
- `PUT /api/invoices/[id]` - Update an invoice
- `DELETE /api/invoices/[id]` - Delete an invoice
- `PUT /api/invoices/[id]/approve` - Approve an invoice
- `PUT /api/invoices/[id]/reject` - Reject an invoice

## Database Schema

### Invoice
- `id`: Unique identifier
- `invoiceNumber`: Invoice number
- `vendor`: Vendor/supplier name
- `amount`: Invoice total amount
- `currency`: Currency code (default: USD)
- `invoiceDate`: Invoice date
- `dueDate`: Payment due date
- `status`: Invoice status (PENDING, APPROVED, REJECTED, READY_FOR_PAYOUT)
- `fileUrl`: Path to uploaded invoice file
- `extractedData`: Raw OCR extracted data (JSON)
- `notes`: Additional notes
- `rejectionReason`: Reason for rejection (if applicable)
- `approvedBy`: User who approved the invoice
- `approvedAt`: Approval timestamp

### InvoiceItem
- `id`: Unique identifier
- `invoiceId`: Reference to parent invoice
- `description`: Item description
- `quantity`: Item quantity
- `unitPrice`: Price per unit
- `total`: Line item total

## OCR Extraction

The system uses Tesseract.js to extract the following fields from invoice images:

- Invoice number
- Vendor name
- Invoice date
- Due date
- Total amount
- Currency
- Line items (description, quantity, unit price, total)

**Note**: OCR accuracy varies based on image quality. Users can manually edit extracted data after upload.

## Configuration

Environment variables (`.env`):

- `DATABASE_URL`: Database connection string
- `UPLOAD_DIR`: Directory for uploaded files (default: `./public/uploads`)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 10MB)
- `NEXT_PUBLIC_APP_URL`: Application URL

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] Email notifications for approval requests
- [ ] Vendor management and auto-complete
- [ ] Advanced OCR with machine learning
- [ ] Integration with accounting software (QuickBooks, Xero)
- [ ] Batch processing
- [ ] Advanced reporting and analytics
- [ ] Multi-currency support with conversion
- [ ] Audit trail and history tracking
- [ ] Mobile app for approvals
- [ ] Webhook integrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
