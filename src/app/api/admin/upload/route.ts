import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${uuidv4().slice(0, 8)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'admin');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return Response.json({ url: `/images/admin/${filename}` }, { status: 201 });
}
