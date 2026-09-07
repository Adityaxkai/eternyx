import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

export async function POST(request: NextRequest) {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json(
        { error: 'Google Drive credentials not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { filename: originalName, mimeType = 'video/mp4', fileSize } = body;

    if (!fileSize || fileSize <= 0) {
      return NextResponse.json(
        { error: 'Valid file size is required to initialize upload.' },
        { status: 400 }
      );
    }

    const ext = originalName ? originalName.split('.').pop() : 'mp4';
    const filename = `${uuidv4().slice(0, 8)}.${ext}`;

    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to retrieve Google Drive access token.' },
        { status: 500 }
      );
    }

    // Google Drive Resumable Upload session initiation
    // Passing the client's Origin instructs Google Drive to set Access-Control-Allow-Origin headers
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    const originHost = origin ? new URL(origin).origin : '';

    const initHeaders: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': mimeType,
      'X-Upload-Content-Length': String(fileSize),
    };

    if (originHost) {
      initHeaders['Origin'] = originHost;
    }

    const driveRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      {
        method: 'POST',
        headers: initHeaders,
        body: JSON.stringify({
          name: filename,
          parents: FOLDER_ID ? [FOLDER_ID] : [],
        }),
      }
    );

    if (!driveRes.ok) {
      const errText = await driveRes.text();
      console.error('Google Drive session init error:', driveRes.status, errText);
      return NextResponse.json(
        { error: `Google Drive upload session failed: ${errText}` },
        { status: driveRes.status }
      );
    }

    const uploadUrl = driveRes.headers.get('location') || driveRes.headers.get('Location');
    if (!uploadUrl) {
      return NextResponse.json(
        { error: 'Google Drive did not return a resumable upload location.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploadUrl,
      filename,
      success: true,
    });
  } catch (error: any) {
    console.error('Upload init error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while initiating upload' },
      { status: 500 }
    );
  }
}
