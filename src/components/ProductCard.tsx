import React from 'react';
import { Heart, ShoppingCart, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const savings = product.originalPrice - product.rescuePrice;
  const timeRemaining = formatDistanceToNow(parseISO(product.bestBefore), { addSuffix: true });
  
  return (
    <Link to={`/product/${product.id}`} className="card group cursor-pointer flex flex-col h-full bg-surface-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="badge bg-text-primary text-surface-white">
            {product.discountPercentage}% OFF
          </span>
          <span className="badge bg-surface-white/95 backdrop-blur-md text-text-primary flex items-center gap-1.5 shadow-sm">
            <Clock size={10} className="text-accent-amber" strokeWidth={3} />
            Ends {timeRemaining}
          </span>
        </div>
        <button 
          className="absolute top-4 right-4 p-2.5 bg-surface-white/90 backdrop-blur-sm rounded-full text-text-secondary hover:text-brand-forest hover:bg-surface-white transition-all opacity-0 group-hover:opacity-100 shadow-sm translate-y-1 group-hover:translate-y-0 duration-300"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={18} strokeWidth={2.5} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="font-semibold text-lg text-text-primary leading-tight line-clamp-1">{product.name}</h3>
        </div>
        
        <p className="text-sm text-text-secondary mb-4 flex items-center gap-1.5 font-medium">
          {product.sellerName}
          {product.distance && (
            <>
              <span className="text-border/80">•</span>
              <span className="flex items-center gap-0.5"><MapPin size={12} strokeWidth={2.5} /> {product.distance}</span>
            </>
          )}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-2xl font-bold text-text-primary tracking-tight">₹{product.rescuePrice.toFixed(2)}</span>
            <span className="text-sm text-text-secondary line-through font-medium">₹{product.originalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs font-semibold text-brand-fresh mb-5 tracking-wide uppercase">You save ₹{savings.toFixed(2)}</p>
          
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-text-primary font-bold bg-surface-ivory px-3 py-1.5 rounded-md">
              {product.availableQuantity} left
            </div>
            <button 
              className="btn-primary py-2.5 px-4 flex-1 text-sm flex items-center justify-center gap-2 group/btn"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
            >
              <ShoppingCart size={16} strokeWidth={2.5} className="transition-transform group-hover/btn:scale-110" />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
