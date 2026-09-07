import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const getDriveClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  return google.drive({ version: 'v3', auth: oauth2Client });
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    if (!rawId) {
      return new NextResponse('Missing video ID', { status: 400 });
    }

    // Extract file ID if a full URL was passed
    let fileId = rawId;
    if (rawId.includes('id=')) {
      const match = rawId.match(/id=([a-zA-Z0-9_-]+)/);
      if (match) fileId = match[1];
    }

    const drive = getDriveClient();

    // Get metadata (file size, mimeType)
    const meta = await drive.files.get({
      fileId,
      fields: 'size, mimeType, name',
    });

    const fileSize = Number(meta.data.size) || 0;
    const mimeType = meta.data.mimeType || 'video/mp4';
    const rangeHeader = request.headers.get('range');

    if (rangeHeader && fileSize > 0) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const driveStream = await drive.files.get(
        { fileId, alt: 'media' },
        {
          responseType: 'stream',
          headers: { Range: `bytes=${start}-${end}` },
        }
      );

      const webStream = new ReadableStream({
        start(controller) {
          driveStream.data.on('data', (chunk: any) => controller.enqueue(chunk));
          driveStream.data.on('end', () => controller.close());
          driveStream.data.on('error', (err: any) => controller.error(err));
        },
      });

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': mimeType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Full video stream
    const driveStream = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const webStream = new ReadableStream({
      start(controller) {
        driveStream.data.on('data', (chunk: any) => controller.enqueue(chunk));
        driveStream.data.on('end', () => controller.close());
        driveStream.data.on('error', (err: any) => controller.error(err));
      },
    });

    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    if (fileSize > 0) {
      headers['Content-Length'] = String(fileSize);
    }

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Video streaming error:', error);
    return new NextResponse(error.message || 'Error streaming video', { status: 500 });
  }
}
