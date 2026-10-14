import { describe, it, expect } from 'vitest';
import { resolveProductImageUrl, DEFAULT_FALLBACK_IMAGE, CROISSANT_IMAGE } from '../lib/supabase';

describe('Product Image Resolution System', () => {
  it('corrects the broken croissant URL from karu.com.py to a verified high-res image', () => {
    const brokenUrl = 'https://karu.com.py/storage/productos/854601706287435.jpg';
    const resolved = resolveProductImageUrl(brokenUrl, 'Assorted Croissants (Box of 4)');
    expect(resolved).toBe(CROISSANT_IMAGE);
    expect(resolved).not.toContain('karu.com.py');
  });

  it('corrects broken croissant CDN references to verified croissant asset', () => {
    const resolved = resolveProductImageUrl('', 'Chocolate Croissant');
    expect(resolved).toBe(CROISSANT_IMAGE);
  });

  it('preserves valid absolute HTTPS URLs without double-prepending', () => {
    const validUrl = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800';
    const resolved = resolveProductImageUrl(validUrl, 'Chocolate Truffle Cake');
    expect(resolved).toBe(validUrl);
  });

  it('returns default fallback when empty or null is passed', () => {
    expect(resolveProductImageUrl('', 'Organic Vegetable Box')).toBe(DEFAULT_FALLBACK_IMAGE);
    expect(resolveProductImageUrl(null, 'Coffee Beans')).toBe(DEFAULT_FALLBACK_IMAGE);
    expect(resolveProductImageUrl(undefined, 'Generic Meal')).toBe(DEFAULT_FALLBACK_IMAGE);
  });

  it('preserves base64 data URIs from local file upload preview', () => {
    const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY44YAAAAASUVORK5CYII=';
    const resolved = resolveProductImageUrl(dataUri, 'Fresh Bread');
    expect(resolved).toBe(dataUri);
  });
});
