import { useState } from 'react';
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

const Navbar = () => {
  const { cart, favorites } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-surface-white/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-12">
            <Link to="/" onClick={closeMenu} className="text-2xl font-display font-extrabold text-brand-deep tracking-tight">RePlate.</Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/explore" className="text-sm font-semibold text-text-primary hover:text-brand-forest transition-colors">Explore</Link>
              <Link to="/explore" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Rescue Deals</Link>
              <Link to="/how-it-works" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">How It Works</Link>
              <Link to="/impact" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Impact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/seller" className="hidden lg:block text-sm font-semibold text-text-primary hover:text-brand-forest transition-colors">For Businesses</Link>
            <div className="w-px h-6 bg-border/60 hidden lg:block" />
            <div className="flex items-center gap-4">
              <button type="button" aria-label="Search deals" onClick={() => navigate('/explore')} className="text-text-primary hover:text-brand-forest transition-colors"><Search size={20} strokeWidth={2.5} /></button>
              <button type="button" aria-label="View favorites" onClick={() => navigate('/favorites')} className="relative hidden sm:block text-text-primary hover:text-brand-forest transition-colors"><Heart size={20} strokeWidth={2.5} />{favorites.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-critical text-surface-white rounded-full text-[10px] flex items-center justify-center">{favorites.length}</span>}</button>
              <button type="button" aria-label="View cart" onClick={() => navigate('/cart')} className="relative text-text-primary hover:text-brand-forest transition-colors"><ShoppingCart size={20} strokeWidth={2.5} />{cartItemCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-forest text-surface-white flex items-center justify-center rounded-full text-[10px] font-bold">{cartItemCount}</span>}</button>
              <button type="button" aria-label="Account is unavailable in demo" onClick={() => navigate('/contact')} className="hidden sm:block text-text-primary hover:text-brand-forest transition-colors"><User size={20} strokeWidth={2.5} /></button>
              <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((open) => !open)} className="md:hidden text-text-primary hover:text-brand-forest transition-colors">{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-border/50 py-4 flex flex-col gap-3">
            {[
              ['/explore', 'Explore'], ['/favorites', 'Favorites'], ['/seller', 'For Businesses'],
              ['/how-it-works', 'How It Works'], ['/impact', 'Impact'], ['/cart', 'Cart'],
            ].map(([path, label]) => <Link key={path} to={path} onClick={closeMenu} className="px-2 py-2 text-sm font-semibold text-text-primary hover:text-brand-forest">{label}</Link>)}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
