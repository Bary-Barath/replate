import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-deep text-surface-ivory pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-display font-bold text-surface-white mb-6">RePlate.</h2>
            <p className="text-surface-ivory/80 text-sm leading-relaxed mb-6">
              Good food deserves another chance. Discover great food at better prices while helping reduce avoidable food waste.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-surface-white mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">About RePlate</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">How It Works</Link></li>
              <li><Link to="/impact" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">Our Impact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-surface-white mb-4">Business</h3>
            <ul className="space-y-3">
              <li><Link to="/seller" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">For Businesses</Link></li>
              <li><Link to="/feed-rescue" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">Feed Rescue</Link></li>
              <li><Link to="/safety" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">Food Safety</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-surface-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">Help Centre</Link></li>
              <li><Link to="/contact" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-surface-ivory/80 hover:text-surface-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-surface-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-surface-ivory/60">
            © {new Date().getFullYear()} RePlate. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
