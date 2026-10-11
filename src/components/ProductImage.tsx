import { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800';
const CROISSANT_FALLBACK = 'https://thefrenchlettuce.com/cdn/shop/files/The-French-Lettuce-Plain-Croissant-Box-Shop-Online-Carlton-Bulleencopy-501603_1200x1200.jpg?v=1732779649';

interface ProductImageProps { src?: string; alt: string; className?: string; fallbackSrc?: string; }

const ProductImage = ({ src, alt, className = '', fallbackSrc = FALLBACK_IMAGE }: ProductImageProps) => {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [loaded, setLoaded] = useState(false);
  return <div className={`relative overflow-hidden bg-brand-lime/20 ${className}`}>
    {!loaded && <div className="absolute inset-0 animate-pulse bg-brand-lime/10" aria-hidden="true" />}
    <img src={imageSrc} alt={alt} className="w-full h-full object-cover" loading="lazy" onLoad={() => setLoaded(true)} onError={() => { if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc); else if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE); else setLoaded(true); }} />
  </div>;
};

export { CROISSANT_FALLBACK };
export default ProductImage;
