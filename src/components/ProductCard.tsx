import { Clock, Heart, MapPin, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useAppContext } from '../context/useAppContext';
import { isProductPurchasable } from '../utils/eligibility';
import RescueClock from './RescueClock';
import { calculateRescueRecommendation } from '../utils/rescueEngine';
import { useAuth } from '../context/useAuth';
import ProductImage, { CROISSANT_FALLBACK } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isFavorite, toggleFavorite } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const savings = product.originalPrice - product.rescuePrice;
  const favorite = isFavorite(product.id);
  const purchasable = isProductPurchasable(product);
  const recommendation = calculateRescueRecommendation(product);

  return (
    <article className="card group flex flex-col h-full bg-surface-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <ProductImage src={product.imageUrl} alt={product.name} fallbackSrc={product.name.toLowerCase().includes('croissant') ? CROISSANT_FALLBACK : undefined} className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          <span className="badge bg-text-primary text-surface-white">{product.discountPercentage}% OFF</span>
          <span className="badge bg-surface-white/95 text-text-primary flex items-center gap-1.5 shadow-sm">
            <Clock size={10} className="text-accent-amber" strokeWidth={3} />
            <RescueClock deadline={product.pickupDeadline ?? product.bestBefore} />
          </span>
        </div>
        <button
          type="button"
          aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          aria-pressed={favorite}
          className={`absolute top-4 right-4 p-2.5 bg-surface-white/90 rounded-full transition-all shadow-sm ${favorite ? 'text-accent-critical opacity-100' : 'text-text-secondary opacity-0 group-hover:opacity-100'}`}
          onClick={() => user ? toggleFavorite(product.id) : navigate(`/auth/sign-in?redirect=/product/${product.id}`)}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="font-semibold text-lg text-text-primary leading-tight line-clamp-1 hover:text-brand-forest">
          {product.name}
        </Link>
        <p className="text-sm text-text-secondary mb-4 flex items-center gap-1.5 font-medium">
          {product.sellerName}
          {product.distance && <><span className="text-border/80">•</span><span className="flex items-center gap-0.5"><MapPin size={12} strokeWidth={2.5} /> {product.distance}</span></>}
        </p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-2xl font-bold text-text-primary tracking-tight">₹{product.rescuePrice.toFixed(2)}</span>
            <span className="text-sm text-text-secondary line-through font-medium">₹{product.originalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-5"><p className="text-xs font-semibold text-brand-fresh tracking-wide uppercase">You save ₹{savings.toFixed(2)}</p>{recommendation.label !== 'Insufficient data' && <span className={`text-[10px] uppercase tracking-wider font-bold ${recommendation.label === 'High' ? 'text-accent-amber' : 'text-text-secondary'}`}>{recommendation.label} priority</span>}</div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-text-primary font-bold bg-surface-ivory px-4 py-2 rounded-full shadow-inner">{product.availableQuantity} left</div>
            <button
              type="button"
              disabled={!purchasable}
              className="btn-primary py-2.5 px-6 flex-1 text-sm flex items-center justify-center gap-2"
              onClick={() => user ? addToCart(product) : navigate(`/auth/sign-in?redirect=/product/${product.id}`)}
            >
              <ShoppingCart size={16} strokeWidth={2.5} />
              {purchasable ? 'Add' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
