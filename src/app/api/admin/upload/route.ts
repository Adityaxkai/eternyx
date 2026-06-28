import { google } from 'googleapis';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Helper to get Google Drive Client
const getDriveClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to Readable stream for the drive upload
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${uuidv4().slice(0, 8)}.${ext}`;

    const drive = getDriveClient();

    // 1. Upload the file to Google Drive
    const fileMetadata = {
      name: filename,
      parents: FOLDER_ID ? [FOLDER_ID] : [],
    };

    const media = {
      mimeType: file.type || 'application/octet-stream',
      body: bufferStream,
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    const fileId = driveResponse.data.id;

    if (!fileId) {
      throw new Error('Failed to retrieve file ID from Google Drive response');
    }

    // 2. Share the file publicly so anyone can view it on the website
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 3. Return the direct access URL using Google's public thumbnail/embed format
    const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;

    return Response.json({ url }, { status: 201 });
  } catch (error: any) {
    console.error('Google Drive Upload Error:', error);
    return Response.json(
      { error: error.message || 'Failed to upload to Google Drive' },
      { status: 500 }
    );
  }
}


