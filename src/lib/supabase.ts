import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Check if credentials exist and are not placeholder strings
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800';
export const CROISSANT_IMAGE = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800';

/**
 * Resolves any image reference to a valid, loadable URL:
 * - Direct HTTP/HTTPS URLs (including Unsplash or CDN) are kept clean and not double-prepended.
 * - Inaccessible/broken karu.com.py URLs are safely redirected to verified high-res croissant images.
 * - Storage paths are converted to public URLs using the Supabase client when configured.
 * - Data URLs and local paths are respected.
 */
export const resolveProductImageUrl = (imageRef?: string | null, productName?: string): string => {
  if (!imageRef || imageRef.trim() === '') {
    if (productName && productName.toLowerCase().includes('croissant')) {
      return CROISSANT_IMAGE;
    }
    return DEFAULT_FALLBACK_IMAGE;
  }

  const trimmed = imageRef.trim();

  // Fix the known broken croissant image from karu.com.py or broken hostnames
  if (trimmed.includes('karu.com.py') || (productName && productName.toLowerCase().includes('croissant') && trimmed.includes('thefrenchlettuce.com'))) {
    return CROISSANT_IMAGE;
  }

  // Already an absolute URL or base64 data URI
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Supabase Storage path
  if (supabase && isSupabaseConfigured) {
    const cleanPath = trimmed.replace(/^product-images\//, '');
    const { data } = supabase.storage.from('product-images').getPublicUrl(cleanPath);
    return data.publicUrl;
  }

  // Local asset or relative fallback
  return trimmed;
};

/**
 * Uploads a product image file to Supabase Storage if configured,
 * otherwise converts to a data URL for persistent client storage.
 */
export const uploadProductImage = async (
  file: File,
  folder = 'products'
): Promise<{ url: string; path?: string; error?: string }> => {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    if (supabase && isSupabaseConfigured) {
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
        // Fall back to data URL so the user is never blocked from adding a product
        const fallbackDataUrl = await readFileAsDataUrl(file);
        return { url: fallbackDataUrl, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path,
      };
    }

    // Demo / offline fallback mode
    const dataUrl = await readFileAsDataUrl(file);
    return { url: dataUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown image upload failure';
    console.error('Failed to upload product image:', message);
    return { url: DEFAULT_FALLBACK_IMAGE, error: message };
  }
};

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
