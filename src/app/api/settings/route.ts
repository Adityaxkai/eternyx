import { settingsService } from '@/services/settingsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await settingsService.getAll();
    const publicSettings = {
      storeName: settings.storeName || 'Eternyx Luxury Fragrances',
      email: settings.email || 'support@eternyx.com',
      phone: settings.phone || '+1 (555) 123-4567',
      currency: settings.currency || 'USD',
      primaryColor: settings.primaryColor || '#d4af37',
      tagline: settings.tagline || 'The Art of Invisible Luxury',
      footerConfig: settings.footerConfig || null,
      footerText: settings.footerText || '© 2026 Eternyx. All rights reserved.',
      instagramUrl: settings.instagramUrl || '',
      facebookUrl: settings.facebookUrl || '',
      twitterUrl: settings.twitterUrl || ''
    };
    return Response.json(publicSettings);
  } catch (error) {
    console.error('Failed to get public settings:', error);
    return Response.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}
