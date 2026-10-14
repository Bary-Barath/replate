import { Link } from 'react-router-dom';

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-surface-secondary/80 border-t border-glass-border text-text-primary pt-16 pb-10 backdrop-blur-xl transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="text-2xl font-display font-extrabold text-brand-forest mb-4 block tracking-tight">
              RePlate.
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed mb-6 max-w-xs">
              Transforming surplus food into recovered value. Empowering local bakeries, markets, and consumers to cut down landfill waste while enjoying great meals.
            </p>
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-brand-mint text-brand-forest text-[10px] font-extrabold uppercase tracking-wider">
              <span>●</span> Verified Human Food Rescue
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-text-primary mb-4">Marketplace</h3>
            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li>
                <Link to="/explore" className="hover:text-brand-forest transition-colors font-medium">
                  Explore Deals
                </Link>
              </li>
              <li>
                <Link to="/nearby" className="hover:text-brand-forest transition-colors font-medium">
                  Nearby Radar
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-brand-forest transition-colors font-medium">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-brand-forest transition-colors font-medium">
                  Impact Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-text-primary mb-4">Partners & Sellers</h3>
            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li>
                <Link to="/seller" className="hover:text-brand-forest transition-colors font-medium">
                  Seller Hub
                </Link>
              </li>
              <li>
                <Link to="/for-businesses" className="hover:text-brand-forest transition-colors font-medium">
                  For Food Businesses
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-brand-forest transition-colors font-medium">
                  Food Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/feed-rescue" className="hover:text-brand-forest transition-colors font-medium">
                  Feed Rescue Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-text-primary mb-4">Trust & Compliance</h3>
            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li>
                <Link to="/about" className="hover:text-brand-forest transition-colors font-medium">
                  About RePlate
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-forest transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-forest transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-brand-forest transition-colors font-medium">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-emeraldSubtle pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <p>© {currentYear} RePlate Marketplace 2.0. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-forest" />
            <span>Built with Supabase, PostgreSQL & 3D Glassmorphism</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
