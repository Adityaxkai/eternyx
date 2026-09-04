const { google } = require('googleapis');
const { Readable } = require('stream');
require('dotenv').config({ path: '.env.local' });

async function testDriveUpload() {
  const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

  console.log('Testing Google Drive upload with credentials...');
  console.log('- Client ID:', CLIENT_ID ? 'Set' : 'Missing');
  console.log('- Client Secret:', CLIENT_SECRET ? 'Set' : 'Missing');
  console.log('- Refresh Token:', REFRESH_TOKEN ? 'Set' : 'Missing');
  console.log('- Folder ID:', FOLDER_ID ? 'Set' : 'Missing');

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  // Create a tiny text stream
  const bufferStream = new Readable();
  bufferStream.push('test connection file');
  bufferStream.push(null);

  try {
    const fileMetadata = {
      name: 'test-connection.txt',
      parents: FOLDER_ID ? [FOLDER_ID] : [],
    };

    const media = {
      mimeType: 'text/plain',
      body: bufferStream,
    };

    console.log('Uploading test file...');
    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    const fileId = driveResponse.data.id;
    console.log('✓ File successfully uploaded! File ID:', fileId);

    console.log('Sharing file publicly...');
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    console.log('✓ File shared publicly!');

    // Clean up: delete test file
    console.log('Cleaning up (deleting test file)...');
    await drive.files.delete({ fileId: fileId });
    console.log('✓ Cleanup complete! Connection is 100% WORKING!');
  } catch (error) {
    console.error('✗ Google Drive Connection FAILED:', error.message);
    if (error.response) {
      console.error('Error Details:', error.response.data);
    }
  }
}

testDriveUpload().catch(console.error);
