import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Tag, TrendingDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../mockData';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-surface-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            <div className="z-10">
              <span className="text-brand-fresh font-bold tracking-wider text-sm uppercase mb-4 block">
                Food Rescue Marketplace
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-extrabold text-brand-deep leading-tight mb-6">
                Good food shouldn't become waste.
              </h1>
              <p className="text-xl text-text-secondary mb-2 font-medium">
                Rescue it. Save money. Make an impact.
              </p>
              <p className="text-lg text-text-secondary mb-8 max-w-lg">
                Discover quality food from local businesses at up to 75% off before it reaches its applicable sale deadline.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/explore" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
                  Explore Rescue Deals <ArrowRight size={20} />
                </Link>
                <Link to="/seller" className="btn-secondary text-lg px-8 py-4">
                  I'm a Food Business
                </Link>
              </div>
            </div>
            
            <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200" 
                alt="Fresh bakery items" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 to-transparent"></div>
              
              {/* Floating Offer Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-surface-white/95 backdrop-blur rounded-2xl p-4 shadow-lg flex items-center gap-4 transform transition-transform hover:scale-[1.02]">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200" 
                  alt="Chocolate Croissant" 
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-grow">
                  <h4 className="font-bold text-text-primary">Chocolate Croissant</h4>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-xl font-bold text-brand-forest">₹39</span>
                    <span className="text-sm text-text-secondary line-through mb-0.5">₹120</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="badge bg-accent-amber text-surface-white mb-2">68% OFF</span>
                  <span className="text-xs font-semibold text-text-secondary">4 days left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-brand-forest text-surface-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Tag size={32} className="text-accent-amber" />
              <h4 className="font-semibold text-lg">Up to 75% Off</h4>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck size={32} className="text-brand-fresh" />
              <h4 className="font-semibold text-lg">Transparent Dates</h4>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-surface-ivory flex items-center justify-center">
                <span className="font-bold text-sm">₹</span>
              </div>
              <h4 className="font-semibold text-lg">Trusted Local Businesses</h4>
            </div>
            <div className="flex flex-col items-center gap-3">
              <TrendingDown size={32} className="text-accent-amber" />
              <h4 className="font-semibold text-lg">Less Food Waste</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Rescue Deals */}
      <section className="py-20 bg-surface-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-2">Good food. Better prices.</h2>
              <p className="text-text-secondary text-lg">Discover today's best rescue deals.</p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center gap-2 text-brand-forest font-semibold hover:text-brand-deep transition-colors">
              View all deals <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 md:hidden">
            <Link to="/explore" className="btn-secondary w-full">View all deals</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface-ivory border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">How RePlate Works</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">A simple way to save money and the planet simultaneously.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-forest text-surface-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">01</div>
              <h3 className="text-xl font-bold mb-3">Businesses list surplus</h3>
              <p className="text-text-secondary leading-relaxed">Local businesses list eligible surplus food that hasn't reached its sale deadline.</p>
            </div>
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-0 w-full border-t-2 border-dashed border-border -z-10"></div>
              <div className="w-16 h-16 bg-brand-forest text-surface-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">02</div>
              <h3 className="text-xl font-bold mb-3">Smart pricing recommends</h3>
              <p className="text-text-secondary leading-relaxed">Our engine recommends a rescue discount based on the remaining shelf life.</p>
            </div>
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-0 w-full border-t-2 border-dashed border-border -z-10"></div>
              <div className="w-16 h-16 bg-brand-forest text-surface-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">03</div>
              <h3 className="text-xl font-bold mb-3">Customers purchase</h3>
              <p className="text-text-secondary leading-relaxed">You discover and buy quality products at a fraction of the price before the deadline.</p>
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
