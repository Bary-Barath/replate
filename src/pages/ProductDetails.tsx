import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, MapPin, Clock, ShieldCheck, Tag } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import { format, parseISO } from 'date-fns';
import { isProductPurchasable } from '../utils/eligibility';
import RescueClock from '../components/RescueClock';
import { calculateRescueRecommendation } from '../utils/rescueEngine';
import { useAuth } from '../context/useAuth';
import ProductImage from '../components/ProductImage';

const ProductDetails = () => {
  const { id, productId } = useParams<{ id?: string; productId?: string }>();
  const { products, addToCart, isFavorite, toggleFavorite } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === (id ?? productId));
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-display font-extrabold text-text-primary mb-3">Rescue Deal Not Found</h1>
        <p className="text-text-secondary text-sm mb-6 max-w-sm">
          This listing may have expired, sold out, or been archived by the partner business.
        </p>
        <button type="button" onClick={() => navigate('/explore')} className="btn-primary text-xs">
          Browse Active Deals
        </button>
      </div>
    );
  }

  const savings = product.originalPrice - product.rescuePrice;
  const bestBeforeDate = parseISO(product.bestBefore);
  const purchasable = isProductPurchasable(product);
  const recommendation = calculateRescueRecommendation(product);

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-secondary mb-8">
          <Link to="/" className="hover:text-brand-forest transition-colors">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-brand-forest transition-colors">Explore</Link>
          <span>/</span>
          <span className="text-text-primary font-bold">{product.category}</span>
        </nav>

        {/* Main Product Card */}
        <div className="glass-panel-solid rounded-3xl border border-glass-border overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Image Section */}
            <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                productName={product.name}
                className="w-full h-full min-h-[350px] lg:min-h-[500px]"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                <span className="badge badge-discount shadow-md text-xs px-3 py-1.5">
                  {product.discountPercentage}% OFF
                </span>
                <span
                  className={`badge ${
                    purchasable ? 'bg-surface-white/95 text-text-primary' : 'bg-accent-coral text-accent-amber'
                  } shadow-md flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold`}
                >
                  <Clock size={13} className="text-brand-forest" />
                  <span>
                    {purchasable ? (
                      <RescueClock deadline={product.pickupDeadline ?? product.bestBefore} />
                    ) : (
                      'Unavailable'
                    )}
                  </span>
                </span>
              </div>
            </div>

            {/* Right Information Section */}
            <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <span className="eyebrow mb-1 block">{product.category}</span>
                    <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary leading-tight">
                      {product.name}
                    </h1>
                  </div>

                  <button
                    type="button"
                    aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isFavorite(product.id)}
                    onClick={() =>
                      user ? toggleFavorite(product.id) : navigate(`/auth/sign-in?redirect=/product/${product.id}`)
                    }
                    className={`p-3 rounded-full transition-all ${
                      isFavorite(product.id)
                        ? 'bg-accent-coral text-accent-critical shadow-sm'
                        : 'bg-surface-secondary text-text-secondary hover:text-accent-critical hover:bg-surface-white'
                    }`}
                  >
                    <Heart size={22} fill={isFavorite(product.id) ? 'currentColor' : 'none'} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Seller & Distance */}
                <div className="flex items-center gap-2 text-xs text-text-secondary mb-6">
                  <span className="font-bold text-text-primary">{product.sellerName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={13} className="text-brand-forest" />
                    {product.distance || '1.2 km'}
                  </span>
                </div>

                {/* Price Box */}
                <div className="bg-brand-mint/40 rounded-2xl p-5 mb-6 border border-brand-forest/15">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-4xl font-extrabold text-brand-forest">
                      ₹{product.rescuePrice.toFixed(2)}
                    </span>
                    <span className="text-base text-text-secondary line-through font-semibold">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-brand-forest flex items-center gap-1">
                    <Tag size={13} />
                    You save ₹{savings.toFixed(2)} ({product.discountPercentage}% off regular retail)
                  </p>
                </div>

                {/* Smart Recommendation Banner */}
                {recommendation.label !== 'Insufficient data' && (
                  <div className="bg-surface-secondary/70 border border-border-emeraldSubtle rounded-2xl p-4 mb-6 text-xs">
                    <p className="eyebrow mb-1">Smart Rescue Engine · {recommendation.label} Priority</p>
                    <p className="text-text-secondary leading-relaxed">
                      {recommendation.explanation} Recommended rescue floor: ₹{recommendation.recommendedPrice?.toFixed(2)}.
                    </p>
                  </div>
                )}

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                  <div className="glass-panel rounded-xl p-3.5 border border-glass-border">
                    <span className="text-text-secondary block font-semibold mb-0.5">Best Before</span>
                    <span className="font-bold text-text-primary">{format(bestBeforeDate, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="glass-panel rounded-xl p-3.5 border border-glass-border">
                    <span className="text-text-secondary block font-semibold mb-0.5">Available Stock</span>
                    <span className="font-bold text-brand-forest">{product.availableQuantity} units left</span>
                  </div>
                </div>

                {/* Collection & Food Safety Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-xs">
                  <div className="rounded-xl bg-surface-secondary/50 border border-glass-border p-3.5">
                    <span className="eyebrow block mb-1">Pickup Location</span>
                    <p className="font-bold text-text-primary">{product.collectionLocation ?? 'Store counter'}</p>
                    <p className="text-text-secondary mt-0.5">{product.pickupInstructions}</p>
                  </div>
                  <div className="rounded-xl bg-surface-secondary/50 border border-glass-border p-3.5">
                    <span className="eyebrow block mb-1">Food Information</span>
                    <p className="font-bold text-text-primary">{product.storageInfo ?? 'Refrigerate after collection'}</p>
                    <p className="text-text-secondary mt-0.5">Allergens: {product.allergenInfo ?? 'Declared by store'}</p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="pt-6 border-t border-border/60">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs font-bold text-text-secondary">Quantity:</span>
                  <div className="flex items-center border border-glass-border bg-surface-white rounded-xl overflow-hidden shadow-sm">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 hover:bg-surface-secondary transition-colors font-bold disabled:opacity-40"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !purchasable}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 hover:bg-surface-secondary transition-colors font-bold disabled:opacity-40"
                      onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                      disabled={quantity >= product.availableQuantity || !purchasable}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    disabled={!purchasable}
                    className="btn-secondary flex-1 py-3.5 text-sm"
                    onClick={() => {
                      if (user) addToCart(product, quantity);
                      else navigate(`/auth/sign-in?redirect=/product/${product.id}`);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    disabled={!purchasable}
                    className="btn-primary flex-1 py-3.5 text-sm flex items-center justify-center gap-2 shadow-md"
                    onClick={() => {
                      if (user) {
                        addToCart(product, quantity);
                        navigate('/customer/checkout');
                      } else {
                        navigate(`/auth/sign-in?redirect=/product/${product.id}`);
                      }
                    }}
                  >
                    <ShoppingCart size={16} /> Buy Now
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-text-secondary mt-4">
                  <ShieldCheck size={15} className="text-brand-forest" />
                  <span>Quality checked and 100% eligible for human consumption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
