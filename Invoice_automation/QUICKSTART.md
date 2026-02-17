# Invoice Automation MVP - Quick Start Guide

## What This Does

This is a complete invoice automation system that:
- ✅ Lets users upload invoice images/PDFs via drag-and-drop
- ✅ Automatically extracts data using OCR (Tesseract.js)
- ✅ Stores invoices in a SQLite database with Prisma ORM
- ✅ Provides an approval workflow (Approve/Reject)
- ✅ Displays invoices in a clean, responsive UI

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup (2 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database is already set up!**
   The SQLite database has been initialized with migrations already applied.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

## Using the System

### Upload an Invoice
1. On the home page, drag and drop an invoice image (JPG, PNG, WebP) or PDF
2. The system will automatically:
   - Upload the file
   - Run OCR to extract invoice data
   - Create a database entry
   - Display it in the invoice list

### Review & Approve Invoices
1. Click "View Details" on any invoice
2. Review the extracted information:
   - Invoice number, vendor, amount
   - Date information
   - Line items (if detected)
   - Original invoice image
3. Click "Approve" or "Reject" (with reason)

### Filter Invoices
Use the filter buttons on the home page:
- **All** - Show all invoices
- **Pending** - Show only pending invoices
- **Approved** - Show only approved invoices
- **Rejected** - Show only rejected invoices

## Project Structure

```
├── app/
│   ├── api/invoices/          # API endpoints
│   │   ├── route.ts           # List invoices
│   │   ├── upload/route.ts    # Upload & OCR
│   │   └── [id]/              # Invoice operations
│   ├── invoices/[id]/         # Invoice detail page
│   └── page.tsx               # Home page
├── components/
│   ├── invoices/              # Invoice components
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── ocr/                   # OCR logic
│   ├── prisma.ts              # Database client
│   ├── storage.ts             # File handling
│   ├── types.ts               # TypeScript types
│   └── validation.ts          # Validation schemas
└── prisma/
    └── schema.prisma          # Database schema
```

## API Endpoints

- `POST /api/invoices/upload` - Upload invoice
- `GET /api/invoices` - List invoices (supports ?status=PENDING filter)
- `GET /api/invoices/[id]` - Get invoice details
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice
- `PUT /api/invoices/[id]/approve` - Approve invoice
- `PUT /api/invoices/[id]/reject` - Reject invoice

## Testing the System

### Test with Sample Invoice
1. Create a simple text document with:
   ```
   ACME Corporation
   Invoice #: INV-12345
   Date: 12/15/2023
   Amount: $1,250.00
   ```
2. Take a screenshot or save as image
3. Upload it to the system
4. Check if OCR extracted the data correctly

### Manual Testing Steps
1. Upload multiple invoices
2. Filter by status
3. View invoice details
4. Approve some invoices
5. Reject an invoice with a reason
6. Verify status changes in the list

## Database

The system uses SQLite (file: `dev.db`) for easy development.

### View Database
```bash
npx prisma studio
```
This opens a GUI at http://localhost:5555 to browse your data.

### Reset Database
```bash
rm dev.db
npx prisma migrate dev
```

## Customization

### Change Upload Directory
Edit `.env`:
```
UPLOAD_DIR="./public/uploads"
```

### Change File Size Limit
Edit `.env`:
```
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Improve OCR Accuracy
Edit `lib/ocr/tesseract.ts` to:
- Add preprocessing (contrast, noise reduction)
- Customize regex patterns for your invoice format
- Add confidence thresholds

## Production Deployment

### Environment Variables
For production, update `.env`:
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"  # Use PostgreSQL
UPLOAD_DIR="/var/uploads"  # Or cloud storage
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Switch to PostgreSQL
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. Update `.env` with PostgreSQL connection string
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Use Cloud Storage
Replace `lib/storage.ts` with S3/GCS implementation.

## Troubleshooting

### OCR Not Working
- Ensure image quality is good (not blurry)
- Check console for Tesseract errors
- Try with a simpler, text-heavy invoice

### Database Errors
```bash
npx prisma generate
npx prisma db push
```

### Port Already in Use
```bash
npm run dev -- -p 3001  # Use different port
```

## Next Steps

1. Add user authentication (NextAuth.js)
2. Implement email notifications
3. Add vendor database & autocomplete
4. Create PDF export functionality
5. Build reporting dashboard
6. Add batch upload support
7. Integrate with accounting software

## Support

For issues or questions, check:
- README.md - Full documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tesseract.js Docs](https://tesseract.projectnaptha.com/)

## License

MIT
