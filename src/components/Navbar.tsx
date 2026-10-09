import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-surface-white/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-display font-extrabold text-brand-deep tracking-tight">
              RePlate.
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/explore" className="text-sm font-semibold text-text-primary hover:text-brand-forest transition-colors">Explore</Link>
              <Link to="/rescue" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Rescue Deals</Link>
              <Link to="/how-it-works" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">How It Works</Link>
              <Link to="/impact" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Impact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/seller" className="hidden lg:block text-sm font-semibold text-text-primary hover:text-brand-forest transition-colors">
              For Businesses
            </Link>
            
            <div className="w-px h-6 bg-border/60 hidden lg:block"></div>
            
            <div className="flex items-center gap-4">
              <button className="text-text-primary hover:text-brand-forest transition-colors">
                <Search size={20} strokeWidth={2.5} />
              </button>
              <button className="hidden sm:block text-text-primary hover:text-brand-forest transition-colors">
                <Heart size={20} strokeWidth={2.5} />
              </button>
              <button className="relative text-text-primary hover:text-brand-forest transition-colors">
                <ShoppingCart size={20} strokeWidth={2.5} />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-forest text-surface-white flex items-center justify-center rounded-full text-[10px] font-bold">2</span>
              </button>
              <button className="hidden sm:block text-text-primary hover:text-brand-forest transition-colors">
                <User size={20} strokeWidth={2.5} />
              </button>
              <button className="md:hidden text-text-primary hover:text-brand-forest transition-colors">
                <Menu size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
