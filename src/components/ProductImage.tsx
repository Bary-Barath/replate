import { useState, useEffect } from 'react';
import { resolveProductImageUrl, DEFAULT_FALLBACK_IMAGE, CROISSANT_IMAGE } from '../lib/supabase';
import { ImageOff } from 'lucide-react';

export interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  productName?: string;
  aspectRatio?: string;
  loading?: 'lazy' | 'eager';
}

export const ProductImage = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  productName,
  loading = 'lazy',
}: ProductImageProps) => {
  const isCroissant = (productName || alt || '').toLowerCase().includes('croissant');
  const targetFallback = fallbackSrc || (isCroissant ? CROISSANT_IMAGE : DEFAULT_FALLBACK_IMAGE);

  const initialUrl = resolveProductImageUrl(src, productName || alt);
  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextUrl = resolveProductImageUrl(src, productName || alt);
    setCurrentSrc(nextUrl);
    setHasError(false);
    setIsLoaded(false);
  }, [src, productName, alt]);

  const handleError = () => {
    if (import.meta.env.DEV) {
      console.warn(`[ProductImage] Failed to load image: "${currentSrc}". Falling back to verified asset.`);
    }

    if (currentSrc !== targetFallback) {
      setCurrentSrc(targetFallback);
    } else if (currentSrc !== DEFAULT_FALLBACK_IMAGE) {
      setCurrentSrc(DEFAULT_FALLBACK_IMAGE);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-brand-lime/20 ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-brand-lime/10 via-surface-white/40 to-brand-lime/10 z-10"
          aria-hidden="true"
        />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-surface-ivory text-text-secondary">
          <ImageOff size={24} className="mb-1 text-accent-warning opacity-70" />
          <span className="text-[11px] font-medium leading-tight line-clamp-1">{alt || 'Product image'}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt || 'Rescue product image'}
          loading={loading}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
        />
      )}
    </div>
  );
};

export { CROISSANT_IMAGE as CROISSANT_FALLBACK };
export default ProductImage;
