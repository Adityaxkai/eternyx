import { settingsService } from '@/services/settingsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await settingsService.getAll();
    return Response.json(settings);
  } catch (error) {
    console.error('Failed to get settings:', error);
    return Response.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const settings = await settingsService.getAll();
    const updated = { ...settings, ...body };
    
    for (const [key, val] of Object.entries(updated)) {
      await settingsService.set(key, val);
    }
    
    return Response.json(updated);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return Response.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
