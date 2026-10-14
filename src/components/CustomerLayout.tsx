import { BarChart3, Heart, Home, Package, ShoppingBag, UserRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const CustomerLayout = () => {
  const { user } = useAuth();
  const links = [
    ['/customer/dashboard', 'Overview', Home],
    ['/customer/orders', 'My Rescues', Package],
    ['/customer/wishlist', 'Wishlist', Heart],
    ['/customer/impact', 'My Impact', BarChart3],
    ['/customer/profile', 'Profile', UserRound],
  ] as const;

  return (
    <div className="min-h-[calc(100vh-5rem)] py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <span className="eyebrow">Customer Hub</span>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Friend'}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <nav className="glass-panel-solid rounded-3xl border border-glass-border p-3 shadow-sm grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-1 gap-1.5">
              {links.map(([path, label, Icon]) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-forest text-surface-white shadow-sm'
                        : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
              <NavLink
                to="/customer/cart"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all"
              >
                <ShoppingBag size={16} />
                <span>Cart</span>
              </NavLink>
            </nav>
          </aside>

          <section className="flex-1 min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
