import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Ensure upload directory exists
  const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}-${sanitizedName}`;
  const filepath = path.join(uploadPath, filename);
  
  await writeFile(filepath, buffer);
  
  // Return public URL
  return `/uploads/${filename}`;
}

export function getFilePath(publicUrl: string): string {
  const filename = publicUrl.replace('/uploads/', '');
  return path.join(process.cwd(), UPLOAD_DIR, filename);
}
