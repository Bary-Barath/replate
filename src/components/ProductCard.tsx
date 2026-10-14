import { useState, useRef, useEffect } from 'react';
import { Clock, Heart, MapPin, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useAppContext } from '../context/useAppContext';
import { isProductPurchasable } from '../utils/eligibility';
import RescueClock from './RescueClock';
import { calculateRescueRecommendation } from '../utils/rescueEngine';
import { useAuth } from '../context/useAuth';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isFavorite, toggleFavorite } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number } | null>(null);
  const [canHover, setCanHover] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false
  );

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Constrain tilt to subtle max 8 degrees for a tasteful, non-distracting 3D effect
    const rotateY = (x - 0.5) * 10;
    const rotateX = -(y - 0.5) * 10;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: x * 100,
      glareY: y * 100,
    });
  };

  const handlePointerLeave = () => {
    setTilt(null);
  };

  const savings = product.originalPrice - product.rescuePrice;
  const favorite = isFavorite(product.id);
  const purchasable = isProductPurchasable(product);
  const recommendation = calculateRescueRecommendation(product);

  const transformStyle = tilt
    ? {
        transform: `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-4px)`,
        transition: 'transform 0.1s ease-out',
      }
    : {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
      };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={transformStyle}
      className="card group flex flex-col h-full relative cursor-pointer"
    >
      {/* 3D Restrained Glare Highlight */}
      {tilt && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[1.5rem] z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.35) 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[1.5rem]">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            productName={product.name}
            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges: Soft Coral Discount Badge & Rescue Clock */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 pointer-events-none z-10">
          <span className="badge badge-discount shadow-sm">
            {product.discountPercentage}% OFF
          </span>
          <span className="badge bg-surface-white/90 text-text-primary flex items-center gap-1.5 shadow-sm">
            <Clock size={11} className="text-brand-forest" strokeWidth={2.5} />
            <RescueClock deadline={product.pickupDeadline ?? product.bestBefore} />
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          aria-pressed={favorite}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-sm ${
            favorite
              ? 'bg-surface-white text-accent-critical opacity-100 scale-105'
              : 'bg-surface-white/80 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-accent-critical hover:bg-surface-white'
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (user) toggleFavorite(product.id);
            else navigate(`/auth/sign-in?redirect=/product/${product.id}`);
          }}
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow bg-surface-white/70 backdrop-blur-md">
        <Link
          to={`/product/${product.id}`}
          className="font-bold text-base text-text-primary leading-snug line-clamp-1 hover:text-brand-forest transition-colors mb-1"
        >
          {product.name}
        </Link>

        <p className="text-xs text-text-secondary mb-3 flex items-center gap-1.5 font-medium">
          <span>{product.sellerName}</span>
          {product.distance && (
            <>
              <span className="text-text-secondary/40">•</span>
              <span className="flex items-center gap-0.5 text-text-secondary/80">
                <MapPin size={11} strokeWidth={2} /> {product.distance}
              </span>
            </>
          )}
        </p>

        <div className="mt-auto pt-2 border-t border-brand-emeraldSubtle">
          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-extrabold text-brand-forest tracking-tight">
              ₹{product.rescuePrice.toFixed(2)}
            </span>
            <span className="text-xs text-text-secondary line-through font-medium">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            <p className="text-[11px] font-semibold text-brand-forest tracking-wide">
              Save ₹{savings.toFixed(2)}
            </p>
            {recommendation.label !== 'Insufficient data' && (
              <span
                className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md ${
                  recommendation.label === 'High'
                    ? 'bg-accent-coral text-accent-amber'
                    : 'bg-brand-mint text-brand-forest'
                }`}
              >
                {recommendation.label} Priority
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] text-text-primary font-bold bg-surface-secondary/80 border border-brand-emeraldSubtle px-3 py-1.5 rounded-full">
              {product.availableQuantity} left
            </div>
            <button
              type="button"
              disabled={!purchasable}
              className="btn-primary py-2 px-4 flex-1 text-xs flex items-center justify-center gap-1.5 shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (user) addToCart(product);
                else navigate(`/auth/sign-in?redirect=/product/${product.id}`);
              }}
            >
              <ShoppingCart size={14} strokeWidth={2.5} />
              {purchasable ? 'Rescue' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
