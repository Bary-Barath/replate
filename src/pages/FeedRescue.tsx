import { Wheat, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const FeedRescue = () => {
  const { user } = useAuth();

  return (
    <main className="min-h-screen py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="glass-panel-solid rounded-3xl p-8 md:p-12 border border-glass-border overflow-hidden relative shadow-lg">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-brand-mint/30 blur-3xl" />
          <span className="eyebrow mb-2">Seller Regulatory Protocol</span>

          <div className="max-w-3xl relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-brand-mint/80 text-brand-forest flex items-center justify-center mb-6">
              <Wheat size={28} />
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary tracking-tight">
              Feed Rescue, kept strictly separate by design.
            </h1>

            <p className="text-text-secondary text-base mt-4 leading-relaxed">
              Inventory that is no longer eligible for human consumption can be safely routed to verified animal-feed, composting, or anaerobic digestion partners. It is isolated from the customer marketplace to maintain uncompromising food safety.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="rounded-2xl bg-surface-secondary/60 border border-border-emeraldSubtle p-5">
                <p className="font-bold text-sm text-text-primary">1. Classify</p>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Record reasons why a batch moved beyond human food eligibility.
                </p>
              </div>

              <div className="rounded-2xl bg-surface-secondary/60 border border-border-emeraldSubtle p-5">
                <p className="font-bold text-sm text-text-primary">2. Verify</p>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Hand off exclusively to audited agricultural or composting partners.
                </p>
              </div>

              <div className="rounded-2xl bg-surface-secondary/60 border border-border-emeraldSubtle p-5">
                <p className="font-bold text-sm text-text-primary">3. Track</p>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Maintain strict traceability without mingling with human retail metrics.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="badge badge-mint flex items-center gap-1.5 py-1.5 px-3">
                <ShieldCheck size={14} /> {user?.businessName ?? 'Verified Merchant'} Scope
              </span>
              <Link to="/seller/products" className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
                Manage Inventory <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeedRescue;
