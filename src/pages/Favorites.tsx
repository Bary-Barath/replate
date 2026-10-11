import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/useAppContext';

const Favorites = () => {
  const { products, favorites } = useAppContext();
  const savedProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <div className="min-h-[70vh] max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-center gap-3 mb-3"><Heart className="text-accent-critical" fill="currentColor" /><h1 className="text-4xl font-display font-extrabold">Your Favorites</h1></div>
      <p className="text-text-secondary text-lg mb-10">Keep track of rescue deals you want to come back to.</p>
      {savedProducts.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : (
        <div className="bg-surface-white rounded-2xl border border-border p-12 text-center">
          <Heart size={48} className="mx-auto text-border mb-5" />
          <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
          <p className="text-text-secondary mb-6">Tap the heart on any rescue deal to save it here.</p>
          <Link to="/explore" className="btn-primary">Explore Deals</Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
