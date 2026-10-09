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
    <Link to={`/product/${product.id}`} className="card group cursor-pointer flex flex-col h-full hover:shadow-xl hover:border-brand-forest/30 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="badge bg-brand-forest text-surface-white shadow-sm px-3 py-1 text-sm">
            {product.discountPercentage}% OFF
          </span>
          <span className="badge bg-surface-white/90 backdrop-blur-sm text-text-primary shadow-sm flex items-center gap-1 px-2.5 py-1">
            <Clock size={12} className="text-accent-amber" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Ends {timeRemaining}</span>
          </span>
        </div>
        <button 
          className="absolute top-3 right-3 p-2 bg-surface-white/90 backdrop-blur-sm rounded-full text-text-secondary hover:text-brand-forest hover:bg-surface-white transition-all shadow-sm"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={18} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-text-primary line-clamp-1">{product.name}</h3>
        </div>
        
        <p className="text-sm text-text-secondary mb-3 flex items-center gap-1">
          {product.sellerName}
          {product.distance && (
            <>
              <span className="text-border">•</span>
              <span className="flex items-center gap-0.5"><MapPin size={12} /> {product.distance}</span>
            </>
          )}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-2xl font-bold text-text-primary">₹{product.rescuePrice.toFixed(2)}</span>
            <span className="text-sm text-text-secondary line-through mb-1">₹{product.originalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs font-medium text-brand-fresh mb-4">You save ₹{savings.toFixed(2)}</p>
          
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-text-secondary font-medium bg-surface-ivory px-2 py-1 rounded border border-border">
              {product.availableQuantity} left
            </div>
            <button 
              className="btn-primary py-2 px-4 flex-1 text-sm flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
            >
              <ShoppingCart size={16} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
