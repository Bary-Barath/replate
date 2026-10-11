import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Tag, TrendingDown, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/useAppContext';

const Home = () => {
  const { products } = useAppContext();
  const topDeals = products.slice(0, 4);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-surface-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-forest/5 via-surface-white to-surface-white"></div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 lg:py-32">
            <div className="max-w-xl">
              <span className="inline-block py-1.5 px-3 rounded-full bg-brand-forest/10 text-brand-forest font-bold tracking-wider text-[10px] uppercase mb-6">
                Food Rescue Marketplace
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-text-primary leading-[1.1] mb-6 tracking-tight">
                Good food shouldn't become waste.
              </h1>
              <p className="text-xl text-text-secondary mb-10 leading-relaxed">
                Discover quality food from local businesses at up to 75% off before it reaches its applicable sale deadline.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/explore" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2">
                  Explore Rescue Deals <ArrowRight size={18} />
                </Link>
                <Link to="/seller" className="btn-secondary text-base px-8 py-4">
                  I'm a Food Business
                </Link>
              </div>
            </div>
            
            <div className="relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl shadow-brand-forest/10">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200" 
                alt="Fresh bakery items" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 via-transparent to-transparent"></div>
              
              {/* Floating Offer Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-surface-white/95 backdrop-blur-md rounded-xl p-5 shadow-xl flex items-center gap-5 transform transition-transform hover:scale-[1.02]">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200" 
                  alt="Chocolate Croissant" 
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <h4 className="font-bold text-lg text-text-primary leading-tight">Chocolate Croissant</h4>
                  <p className="text-sm text-text-secondary mb-2">La Petite Boulangerie</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-brand-forest">₹39</span>
                    <span className="text-sm text-text-secondary line-through font-medium">₹120</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end justify-between h-20">
                  <span className="badge bg-text-primary text-surface-white">68% OFF</span>
                  <span className="text-xs font-bold text-accent-amber uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} strokeWidth={3} /> 4 Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-surface-ivory border-y border-border/50 py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-border/50">
            <div className="flex flex-col items-center gap-4">
              <Tag size={28} className="text-brand-forest" strokeWidth={1.5} />
              <h4 className="font-semibold text-text-primary">Up to 75% Off</h4>
            </div>
            <div className="flex flex-col items-center gap-4">
              <ShieldCheck size={28} className="text-brand-forest" strokeWidth={1.5} />
              <h4 className="font-semibold text-text-primary">Transparent Dates</h4>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-7 h-7 rounded-full border-[1.5px] border-brand-forest flex items-center justify-center text-brand-forest">
                <span className="font-bold text-sm">₹</span>
              </div>
              <h4 className="font-semibold text-text-primary">Local Businesses</h4>
            </div>
            <div className="flex flex-col items-center gap-4">
              <TrendingDown size={28} className="text-brand-forest" strokeWidth={1.5} />
              <h4 className="font-semibold text-text-primary">Less Food Waste</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Rescue Deals */}
      <section className="py-24 bg-surface-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-display font-extrabold text-text-primary mb-3 tracking-tight">Good food. Better prices.</h2>
              <p className="text-text-secondary text-lg">Discover today's best rescue deals near you.</p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center gap-2 text-text-primary font-bold hover:text-brand-forest transition-colors text-sm uppercase tracking-wider">
              View all deals <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-10 md:hidden">
            <Link to="/explore" className="btn-secondary w-full">View all deals</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-surface-ivory">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-extrabold text-text-primary mb-4 tracking-tight">How RePlate Works</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">A simple way to save money and the planet simultaneously.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-border"></div>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-surface-white text-brand-forest border border-border/80 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-8 shadow-sm">01</div>
              <h3 className="text-xl font-bold mb-4 text-text-primary">Businesses list surplus</h3>
              <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">Local businesses list eligible surplus food that hasn't reached its sale deadline.</p>
            </div>
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-surface-white text-brand-forest border border-border/80 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-8 shadow-sm">02</div>
              <h3 className="text-xl font-bold mb-4 text-text-primary">Smart pricing</h3>
              <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">Our engine recommends a rescue discount based on the remaining shelf life.</p>
            </div>
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-surface-white text-brand-forest border border-border/80 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-8 shadow-sm">03</div>
              <h3 className="text-xl font-bold mb-4 text-text-primary">Customers rescue</h3>
              <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">You discover and buy quality products at a fraction of the price before the deadline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-brand-deep text-surface-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Leaf size={48} className="text-brand-fresh mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Small purchases. Meaningful impact.</h2>
          <p className="text-surface-ivory/80 text-lg max-w-2xl mx-auto mb-16">
            Every rescue deal you purchase directly reduces avoidable food waste and its associated climate impact.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-accent-amber mb-2">1.2M+</p>
              <p className="text-sm uppercase tracking-wider font-semibold text-surface-ivory/70">Food Rescued (kg)*</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-accent-amber mb-2">₹4.5Cr</p>
              <p className="text-sm uppercase tracking-wider font-semibold text-surface-ivory/70">Customer Savings*</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-accent-amber mb-2">850+</p>
              <p className="text-sm uppercase tracking-wider font-semibold text-surface-ivory/70">Partner Businesses*</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-accent-amber mb-2">3.1M</p>
              <p className="text-sm uppercase tracking-wider font-semibold text-surface-ivory/70">Est. CO2e Avoided (kg)*</p>
            </div>
          </div>
          <p className="text-xs text-surface-ivory/40 mt-12">* Demonstration metrics. Not representing live data.</p>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="py-20 bg-surface-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-surface-ivory rounded-3xl p-12 md:p-16 border border-border">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">Turn surplus into recovered revenue.</h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Give eligible surplus food another chance while recovering value for your business. Join our network of sustainable food partners.
          </p>
          <Link to="/seller" className="btn-primary text-lg px-8 py-4 inline-flex">
            Start Selling
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
