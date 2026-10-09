import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, MapPin, Clock, Info, ShieldCheck } from 'lucide-react';
import { mockProducts } from '../mockData';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find(p => p.id === id) || mockProducts[0]; // fallback for demo
  const [quantity, setQuantity] = useState(1);
  
  if (!product) return <div>Product not found</div>;
  
  const savings = product.originalPrice - product.rescuePrice;
  const bestBeforeDate = parseISO(product.bestBefore);
  const timeRemaining = formatDistanceToNow(bestBeforeDate, { addSuffix: true });
  
  return (
    <div className="bg-surface-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-text-secondary mb-8">
          <Link to="/" className="hover:text-brand-forest transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/explore" className="hover:text-brand-forest transition-colors">Explore</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary font-medium">{product.category}</span>
        </nav>
        
        <div className="bg-surface-white rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-border">
            
            {/* Left Image */}
            <div className="relative aspect-square md:aspect-auto">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="badge bg-brand-forest text-surface-white px-3 py-1.5 text-sm shadow-md">
                  {product.discountPercentage}% OFF
                </span>
                <span className="badge bg-accent-warning text-surface-white shadow-md flex items-center gap-1.5 px-3 py-1.5">
                  <Clock size={14} />
                  <span className="text-xs uppercase font-bold tracking-wider">Ends {timeRemaining}</span>
                </span>
              </div>
            </div>
            
            {/* Right Info */}
            <div className="p-8 lg:p-12 flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-display font-bold text-text-primary">{product.name}</h1>
                <button className="p-3 text-text-secondary hover:text-brand-forest hover:bg-brand-forest/5 rounded-full transition-colors">
                  <Heart size={24} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-text-secondary mb-6">
                <span className="font-semibold text-text-primary">{product.sellerName}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={16} /> {product.distance || 'Local'}</span>
              </div>
              
              {/* Pricing */}
              <div className="bg-brand-forest/5 rounded-2xl p-6 mb-8 border border-brand-forest/10">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-4xl font-bold text-brand-forest">₹{product.rescuePrice.toFixed(2)}</span>
                  <span className="text-xl text-text-secondary line-through mb-1">₹{product.originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-fresh">
                  <Tag size={16} />
                  You save ₹{savings.toFixed(2)}
                </div>
              </div>
              
              {/* Why is this discounted */}
              <div className="bg-surface-ivory rounded-xl p-4 mb-8 text-sm text-text-secondary flex gap-3 items-start border border-border">
                <Info size={20} className="text-accent-amber shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Why is this product discounted?</h4>
                  <p>The seller has reduced the price to encourage purchase before its applicable sale deadline. The product remains fully eligible for sale and safe for consumption.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border border-border rounded-xl p-4">
                  <span className="text-xs uppercase text-text-secondary font-semibold block mb-1">Best Before</span>
                  <span className="font-semibold text-text-primary">{format(bestBeforeDate, 'dd MMM yyyy')}</span>
                </div>
                <div className="border border-border rounded-xl p-4">
                  <span className="text-xs uppercase text-text-secondary font-semibold block mb-1">Available</span>
                  <span className="font-semibold text-text-primary">{product.availableQuantity} items</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-auto pt-8 border-t border-border space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-semibold text-text-primary">Quantity:</span>
                  <div className="flex items-center border border-border rounded-lg bg-surface-ivory overflow-hidden">
                    <button 
                      className="px-4 py-2 hover:bg-border transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >-</button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button 
                      className="px-4 py-2 hover:bg-border transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                      disabled={quantity >= product.availableQuantity}
                    >+</button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="btn-secondary flex-1 py-4 text-lg">Add to Cart</button>
                  <button className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-2">
                    <ShoppingCart size={20} /> Buy Now
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mt-4">
                  <ShieldCheck size={16} className="text-brand-fresh" />
                  Quality checked and eligible for sale
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tag = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
);

export default ProductDetails;
