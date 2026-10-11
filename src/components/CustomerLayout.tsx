import { BarChart3, Heart, Home, Package, ShoppingBag, UserRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const CustomerLayout = () => {
  const { user } = useAuth();
  const links = [['/customer/dashboard', 'Overview', Home], ['/customer/orders', 'My orders', Package], ['/customer/wishlist', 'Wishlist', Heart], ['/customer/impact', 'My impact', BarChart3], ['/customer/profile', 'Profile', UserRound]] as const;
  return <div className="bg-surface-ivory min-h-[calc(100vh-6rem)]"><div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 md:py-12"><div className="mb-8"><p className="text-xs uppercase tracking-widest text-brand-forest font-bold mb-2">Customer space</p><h1 className="text-3xl md:text-4xl font-display font-extrabold">Welcome back, {user?.name.split(' ')[0]}</h1></div><div className="flex flex-col lg:flex-row gap-8"><aside className="lg:w-60 shrink-0"><nav className="bg-surface-white rounded-2xl border border-border/70 p-2 grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-1 gap-1">{links.map(([path, label, Icon]) => <NavLink key={path} to={path} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-brand-forest text-surface-white' : 'text-text-secondary hover:bg-surface-ivory hover:text-text-primary'}`}><Icon size={17} />{label}</NavLink>)}<NavLink to="/cart" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-surface-ivory hover:text-text-primary"><ShoppingBag size={17} />Cart</NavLink></nav></aside><section className="flex-1 min-w-0"><Outlet /></section></div></div></div>;
};

export default CustomerLayout;
