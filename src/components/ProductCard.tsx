import { Clock, Heart, MapPin, ShoppingCart } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useAppContext } from '../context/useAppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isFavorite, toggleFavorite } = useAppContext();
  const savings = product.originalPrice - product.rescuePrice;
  const timeRemaining = formatDistanceToNow(parseISO(product.bestBefore), { addSuffix: true });
  const favorite = isFavorite(product.id);

  return (
    <article className="card group flex flex-col h-full bg-surface-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          <span className="badge bg-text-primary text-surface-white">{product.discountPercentage}% OFF</span>
          <span className="badge bg-surface-white/95 text-text-primary flex items-center gap-1.5 shadow-sm">
            <Clock size={10} className="text-accent-amber" strokeWidth={3} />
            Ends {timeRemaining}
          </span>
        </div>
        <button
          type="button"
          aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          aria-pressed={favorite}
          className={`absolute top-4 right-4 p-2.5 bg-surface-white/90 rounded-full transition-all shadow-sm ${favorite ? 'text-accent-critical opacity-100' : 'text-text-secondary opacity-0 group-hover:opacity-100'}`}
          onClick={() => toggleFavorite(product.id)}
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
          <p className="text-xs font-semibold text-brand-fresh mb-5 tracking-wide uppercase">You save ₹{savings.toFixed(2)}</p>
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-text-primary font-bold bg-surface-ivory px-4 py-2 rounded-full shadow-inner">{product.availableQuantity} left</div>
            <button
              type="button"
              disabled={product.availableQuantity <= 0}
              className="btn-primary py-2.5 px-6 flex-1 text-sm flex items-center justify-center gap-2"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart size={16} strokeWidth={2.5} />
              {product.availableQuantity > 0 ? 'Add' : 'Sold out'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
