import { useState } from 'react';
import { Heart, Menu, Search, ShoppingCart, User, X, Building2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { cart, favorites } = useAppContext();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-surface-white/75 backdrop-blur-xl border-b border-glass-border sticky top-0 z-50 shadow-glass-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-2xl font-display font-extrabold text-brand-forest tracking-tight flex items-center gap-1.5"
            >
              <span>RePlate</span>
              <span className="w-2 h-2 rounded-full bg-brand-lime inline-block" />
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              <Link to="/explore" className="text-xs uppercase tracking-wider font-bold text-text-primary hover:text-brand-forest transition-colors">
                Explore Deals
              </Link>
              <Link to="/nearby" className="text-xs uppercase tracking-wider font-bold text-text-primary hover:text-brand-forest transition-colors">
                Nearby Radar
              </Link>
              <Link to="/how-it-works" className="text-xs uppercase tracking-wider font-medium text-text-secondary hover:text-text-primary transition-colors">
                How It Works
              </Link>
              <Link to="/impact" className="text-xs uppercase tracking-wider font-medium text-text-secondary hover:text-text-primary transition-colors">
                Impact
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/for-businesses"
              className="hidden lg:block text-xs font-bold text-brand-forest hover:underline transition-colors"
            >
              For Food Businesses
            </Link>

            <div className="w-px h-5 bg-border-emeraldSubtle hidden lg:block" />

            <div className="flex items-center gap-3">
              {/* Search button */}
              <button
                type="button"
                aria-label="Search deals"
                onClick={() => navigate('/explore')}
                className="p-2 text-text-secondary hover:text-brand-forest hover:bg-surface-white/70 rounded-full transition-colors cursor-pointer"
              >
                <Search size={18} strokeWidth={2.5} />
              </button>

              {/* Favorites button */}
              <button
                type="button"
                aria-label="View favorites"
                onClick={() => navigate('/favorites')}
                className="relative hidden sm:block p-2 text-text-secondary hover:text-brand-forest hover:bg-surface-white/70 rounded-full transition-colors cursor-pointer"
              >
                <Heart size={18} strokeWidth={2.5} />
                {favorites.length > 0 && (
                  <span className="absolute 1 top-0.5 right-0.5 w-4 h-4 bg-accent-coral text-accent-amber font-extrabold rounded-full text-[9px] flex items-center justify-center shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Cart button */}
              <button
                type="button"
                aria-label="View cart"
                onClick={() => navigate('/customer/cart')}
                className="relative p-2 text-text-secondary hover:text-brand-forest hover:bg-surface-white/70 rounded-full transition-colors cursor-pointer"
              >
                <ShoppingCart size={18} strokeWidth={2.5} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-brand-forest text-surface-white font-extrabold rounded-full text-[9px] flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Auth / Profile Actions */}
              {!user ? (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link
                    to="/auth/sign-in"
                    className="text-xs font-bold text-text-primary hover:text-brand-forest px-3 py-2 rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/sign-up"
                    className="btn-primary text-xs py-2 px-4 shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link
                    to={
                      user.role === 'customer'
                        ? '/customer/dashboard'
                        : user.role === 'seller'
                        ? '/seller/dashboard'
                        : '/admin/dashboard'
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary/70 border border-border-emeraldSubtle text-xs font-bold text-text-primary hover:text-brand-forest hover:bg-surface-white transition-all shadow-xs"
                  >
                    {user.role === 'seller' ? (
                      <Building2 size={13} className="text-brand-forest" />
                    ) : user.role === 'admin' ? (
                      <ShieldCheck size={13} className="text-brand-forest" />
                    ) : (
                      <User size={13} className="text-brand-forest" />
                    )}
                    <span className="max-w-[120px] truncate">{user.businessName || user.name.split(' ')[0]}</span>
                    <span className="badge badge-mint text-[8px] py-0.5 px-1.5 uppercase ml-0.5 font-extrabold">
                      {user.role}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="text-xs text-text-secondary hover:text-brand-forest px-2 py-1 transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((open) => !open)}
                className="md:hidden p-2 text-text-primary hover:text-brand-forest transition-colors cursor-pointer"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-glass-border py-4 flex flex-col gap-2 animate-fadeIn bg-surface-white/95 rounded-b-3xl px-2">
            {[
              ['/explore', 'Explore Deals'],
              ['/nearby', 'Nearby Radar'],
              ['/favorites', 'Favorites'],
              ['/for-businesses', 'For Businesses'],
              ['/how-it-works', 'How It Works'],
              ['/impact', 'Impact'],
              ['/customer/cart', 'Cart'],
              [
                user
                  ? user.role === 'customer'
                    ? '/customer/dashboard'
                    : user.role === 'seller'
                    ? '/seller/dashboard'
                    : '/admin/dashboard'
                  : '/auth/sign-in',
                user ? `Dashboard (${user.role})` : 'Sign In',
              ],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                onClick={closeMenu}
                className="px-3 py-2 text-xs font-bold text-text-primary hover:text-brand-forest hover:bg-brand-mint/40 rounded-xl transition-colors"
              >
                {label}
              </Link>
            ))}
            {user && (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="text-left px-3 py-2 text-xs font-bold text-accent-critical hover:bg-accent-coral/30 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
