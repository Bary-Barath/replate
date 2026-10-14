import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Tag, TrendingDown, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { useAppContext } from '../context/useAppContext';
import { isProductPurchasable } from '../utils/eligibility';

const Home = () => {
  const { products } = useAppContext();
  const topDeals = products.filter(isProductPurchasable).sort((a, b) => a.rescuePrice - b.rescuePrice).slice(0, 4);
  const heroDeal = topDeals[0] ?? products[0];

  // Subtle mouse parallax for hero 3D layer
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canHover, setCanHover] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false
  );

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 16;
    const y = ((clientY - top) / height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden py-16 lg:py-28"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 max-w-2xl">
              <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-brand-mint/80 border border-brand-forest/20 text-brand-forest font-extrabold tracking-wider text-[11px] uppercase mb-6 shadow-sm">
                <Sparkles size={13} className="text-brand-forest" />
                <span>Verified Food Rescue Marketplace</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold text-text-primary leading-[1.08] mb-6 tracking-tight">
                Good food deserves a <span className="text-brand-forest underline decoration-brand-lime decoration-4 underline-offset-6">second chance.</span>
              </h1>

              <p className="text-lg sm:text-xl text-text-secondary mb-8 leading-relaxed font-normal max-w-xl">
                Discover exceptional surplus food from verified local bakeries, cafés and markets at up to 75% off before scheduled pickup deadlines.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/explore" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 shadow-md">
                  Explore Rescue Deals <ArrowRight size={18} />
                </Link>
                <Link to="/seller" className="btn-secondary text-base px-8 py-4 flex items-center justify-center">
                  I'm a Food Business
                </Link>
              </div>

              {/* Trust Micro-Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-emeraldSubtle max-w-lg">
                <div>
                  <p className="text-2xl font-display font-extrabold text-brand-forest">75%</p>
                  <p className="text-[11px] text-text-secondary font-medium">Max discount</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-extrabold text-brand-forest">100%</p>
                  <p className="text-[11px] text-text-secondary font-medium">Quality verified</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-extrabold text-brand-forest">0 kg</p>
                  <p className="text-[11px] text-text-secondary font-medium">Waste tolerated</p>
                </div>
              </div>
            </div>

            {/* Right 3D Layered Composition */}
            <div className="lg:col-span-5 relative perspective-container">
              <div
                style={{
                  transform: canHover
                    ? `rotateY(${mousePos.x.toFixed(2)}deg) rotateX(${(-mousePos.y).toFixed(2)}deg)`
                    : 'none',
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative preserve-3d"
              >
                {/* Main Hero Card Container */}
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-glass-border shadow-glass-hover">
                  <ProductImage
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"
                    alt="Artisan bakery items"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-text-primary/75 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-center pointer-events-none">
                    <span className="badge badge-lime text-xs shadow-sm">
                      Fresh Daily Rescue
                    </span>
                    <span className="badge bg-surface-white/90 text-text-primary text-[10px] shadow-sm font-semibold">
                      Neighborhood Radar
                    </span>
                  </div>
                </div>

                {/* Layered Floating Offer Card */}
                {heroDeal && (
                  <div
                    style={{
                      transform: canHover
                        ? `translateZ(30px) translate(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px)`
                        : 'none',
                      transition: 'transform 0.2s ease-out',
                    }}
                    className="absolute -bottom-6 left-4 right-4 sm:-left-6 sm:right-6 glass-panel-solid rounded-2xl p-4 sm:p-5 shadow-2xl border border-glass-border flex items-center gap-4 animate-float"
                  >
                    <ProductImage
                      src={heroDeal.imageUrl}
                      alt={heroDeal.name}
                      productName={heroDeal.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-glass-border"
                    />

                    <div className="flex-grow min-w-0">
                      <span className="badge badge-discount text-[9px] mb-1">
                        {heroDeal.discountPercentage}% OFF
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-text-primary truncate">
                        {heroDeal.name}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">{heroDeal.sellerName}</p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-extrabold text-brand-forest">
                          ₹{heroDeal.rescuePrice.toFixed(0)}
                        </span>
                        <span className="text-xs text-text-secondary line-through font-medium">
                          ₹{heroDeal.originalPrice.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <Link
                        to={`/product/${heroDeal.id}`}
                        className="btn-primary px-3.5 py-1.5 text-xs font-bold shadow-sm"
                      >
                        Rescue
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="py-12 bg-surface-secondary/50 border-y border-glass-border">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint/80 flex items-center justify-center text-brand-forest shrink-0">
                <Tag size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">Up to 75% Off</h4>
                <p className="text-xs text-text-secondary">Direct rescue savings</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint/80 flex items-center justify-center text-brand-forest shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">Transparent Dates</h4>
                <p className="text-xs text-text-secondary">Labelled best-before</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint/80 flex items-center justify-center text-brand-forest shrink-0">
                <span className="font-bold text-base">₹</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">Local Businesses</h4>
                <p className="text-xs text-text-secondary">Community merchants</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint/80 flex items-center justify-center text-brand-forest shrink-0">
                <TrendingDown size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">Zero Avoidable Waste</h4>
                <p className="text-xs text-text-secondary">Active climate impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Deals Grid */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <span className="eyebrow">Today's Deals</span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary mt-1">
                Good food. Better prices.
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Fresh surplus ready for collection right now.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-brand-forest font-bold text-sm hover:underline"
            >
              View all deals <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/explore" className="btn-secondary w-full">
              View all deals
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-surface-secondary/40 border-y border-glass-border">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="eyebrow">The Simple Lifecycle</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary mt-1">
              How RePlate Works
            </h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto mt-2">
              A transparent, reliable connection between local shops and eco-conscious food lovers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel-solid rounded-3xl p-8 border border-glass-border relative hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint text-brand-forest font-display font-extrabold text-lg flex items-center justify-center mb-6">
                01
              </div>
              <h3 className="font-bold text-lg text-text-primary mb-2">Businesses List Surplus</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Local bakeries and grocers list freshly prepared, surplus items before their scheduled closing or sale deadline.
              </p>
            </div>

            <div className="glass-panel-solid rounded-3xl p-8 border border-glass-border relative hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-brand-lime text-brand-deep font-display font-extrabold text-lg flex items-center justify-center mb-6">
                02
              </div>
              <h3 className="font-bold text-lg text-text-primary mb-2">Smart Rescue Pricing</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our dynamic discount engine recommends balanced prices that reward shoppers while recovering merchant costs.
              </p>
            </div>

            <div className="glass-panel-solid rounded-3xl p-8 border border-glass-border relative hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint text-brand-forest font-display font-extrabold text-lg flex items-center justify-center mb-6">
                03
              </div>
              <h3 className="font-bold text-lg text-text-primary mb-2">Customers Collect & Save</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                You reserve items with zero advance payment and collect delicious food in person, directly diverting it from landfills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Light Emerald Glassmorphism Impact Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="glass-panel rounded-3xl p-10 md:p-14 border border-glass-border bg-gradient-to-br from-brand-mint/40 via-surface-white/90 to-brand-mint/20 text-center shadow-glass relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-brand-forest/10 text-brand-forest flex items-center justify-center mx-auto mb-4">
              <Leaf size={28} />
            </div>

            <span className="eyebrow">Collective Climate Action</span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-text-primary mt-2 mb-4 tracking-tight">
              Small purchases. Meaningful impact.
            </h2>
            <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed">
              Every food rescue directly prevents avoidable landfill methane emissions and conserves the water and energy invested in growing quality food.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-surface-white/60 border border-glass-border">
                <p className="text-3xl md:text-4xl font-display font-extrabold text-brand-forest mb-1">1,240+</p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-text-secondary">Meals Rescued</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-white/60 border border-glass-border">
                <p className="text-3xl md:text-4xl font-display font-extrabold text-brand-forest mb-1">₹3.8L</p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-text-secondary">Customer Savings</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-white/60 border border-glass-border">
                <p className="text-3xl md:text-4xl font-display font-extrabold text-brand-forest mb-1">85+</p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-text-secondary">Partner Stores</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-white/60 border border-glass-border">
                <p className="text-3xl md:text-4xl font-display font-extrabold text-brand-forest mb-1">2,850</p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-text-secondary">kg CO2e Prevented</p>
              </div>
            </div>

            <p className="text-[11px] text-text-secondary/70 mt-8">
              * Based on platform rescue totals and EPA food waste conversion methodology.
            </p>
          </div>
        </div>
      </section>

      {/* Seller CTA Card */}
      <section className="pb-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="glass-panel-solid rounded-3xl p-10 md:p-14 border border-glass-border text-center flex flex-col items-center">
            <span className="eyebrow">For Food Businesses</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary mt-1 mb-3">
              Turn unavoidable surplus into recovered revenue.
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mb-8 leading-relaxed">
              List surplus in seconds, establish local loyal customers, and meet ESG sustainability goals with zero upfront fees.
            </p>
            <Link to="/seller" className="btn-primary text-base px-8 py-3.5">
              Start Rescuing as a Business
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
