import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-surface-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-display font-bold text-brand-forest">
              RePlate.
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-text-primary hover:text-brand-fresh transition-colors">Home</Link>
              <Link to="/explore" className="text-sm font-medium text-text-secondary hover:text-brand-fresh transition-colors">Explore</Link>
              <Link to="/rescue" className="text-sm font-medium text-text-secondary hover:text-brand-fresh transition-colors">Rescue Deals</Link>
              <Link to="/near-me" className="text-sm font-medium text-text-secondary hover:text-brand-fresh transition-colors">Near Me</Link>
              <Link to="/how-it-works" className="text-sm font-medium text-text-secondary hover:text-brand-fresh transition-colors">How It Works</Link>
              <Link to="/impact" className="text-sm font-medium text-text-secondary hover:text-brand-fresh transition-colors">Our Impact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/seller" className="hidden lg:block text-sm font-semibold text-brand-forest hover:text-brand-deep px-4 py-2 rounded-full hover:bg-brand-forest/5 transition-colors">
              List Surplus Food
            </Link>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-text-secondary hover:text-brand-forest transition-colors rounded-full hover:bg-surface-ivory">
                <Search size={20} />
              </button>
              <button className="p-2 text-text-secondary hover:text-brand-forest transition-colors rounded-full hover:bg-surface-ivory hidden sm:block">
                <Heart size={20} />
              </button>
              <button className="p-2 text-text-secondary hover:text-brand-forest transition-colors rounded-full hover:bg-surface-ivory relative">
                <ShoppingCart size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-amber rounded-full"></span>
              </button>
              <button className="p-2 text-text-secondary hover:text-brand-forest transition-colors rounded-full hover:bg-surface-ivory hidden sm:block">
                <User size={20} />
              </button>
              <button className="md:hidden p-2 text-text-secondary hover:text-brand-forest transition-colors rounded-full hover:bg-surface-ivory">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
