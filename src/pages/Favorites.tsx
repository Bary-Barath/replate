import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/useAppContext';

const Favorites = () => {
  const { products, favorites } = useAppContext();
  const savedProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <span className="eyebrow">Saved Items</span>
        <div className="flex items-center gap-2.5 mt-1">
          <Heart className="text-accent-critical" fill="currentColor" size={24} />
          <h1 className="text-2xl font-display font-extrabold text-text-primary">Your Wishlist</h1>
        </div>
        <p className="text-xs text-text-secondary mt-1">Keep track of rescue deals you want to come back to.</p>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass-panel-solid rounded-3xl border border-glass-border p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-brand-mint/60 flex items-center justify-center mx-auto mb-4 text-accent-critical">
            <Heart size={30} />
          </div>
          <h2 className="text-xl font-bold font-display text-text-primary mb-2">No favorites yet</h2>
          <p className="text-xs text-text-secondary mb-6 max-w-sm mx-auto">
            Tap the heart icon on any rescue deal in the marketplace to pin it here.
          </p>
          <Link to="/explore" className="btn-primary text-xs">
            Explore Deals
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
