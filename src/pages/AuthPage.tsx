import { useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, Leaf, UserRound, ShieldAlert, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { UserRole } from '../types';
import { useAuth } from '../context/useAuth';

const AuthPage = ({ mode }: { mode: 'sign-in' | 'sign-up' }) => {
  const {
    signInDemo,
    registerCustomerDemo,
    registerSellerDemo,
    signInWithSupabase,
    signUpWithSupabase,
    isSupabaseConfigured,
  } = useAuth();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState<UserRole>('customer');
  const [sellerForm, setSellerForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    category: 'Bakery',
    phone: '',
    address: '',
  });
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirect = params.get('redirect')?.startsWith('/') ? params.get('redirect')! : undefined;

  const finish = (targetRole: UserRole) => {
    navigate(
      redirect ??
        (targetRole === 'seller'
          ? '/seller/verification'
          : targetRole === 'admin'
          ? '/admin/dashboard'
          : '/customer/dashboard'),
      { replace: true }
    );
  };

  const updateCustomer = (field: keyof typeof customerForm, value: string) =>
    setCustomerForm((current) => ({ ...current, [field]: value }));
  const updateSeller = (field: keyof typeof sellerForm, value: string) =>
    setSellerForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      if (mode === 'sign-in') {
        const email =
          role === 'admin'
            ? 'admin@replate.demo'
            : role === 'seller'
            ? sellerForm.email || 'seller@replate.demo'
            : customerForm.email || 'customer@replate.demo';
        const password = role === 'seller' ? sellerForm.password : customerForm.password || 'password123';

        if (isSupabaseConfigured && (customerForm.email || sellerForm.email)) {
          const res = await signInWithSupabase(email, password);
          if (!res.success) {
            setAuthError(res.error || 'Invalid email or password.');
            setLoading(false);
            return;
          }
        } else {
          // Demo sign in
          signInDemo(role);
        }
      } else {
        // Sign-up
        if (role === 'admin') {
          setRole('customer');
          setLoading(false);
          return;
        }

        if (role === 'customer') {
          if (isSupabaseConfigured) {
            const res = await signUpWithSupabase(
              customerForm.email,
              customerForm.password,
              customerForm.name,
              'customer',
              { phone: customerForm.phone }
            );
            if (!res.success) {
              setAuthError(res.error || 'Registration failed.');
              setLoading(false);
              return;
            }
          } else {
            registerCustomerDemo(customerForm);
          }
        } else {
          // Seller registration
          if (isSupabaseConfigured) {
            const res = await signUpWithSupabase(
              sellerForm.email,
              sellerForm.password,
              sellerForm.ownerName,
              'seller',
              sellerForm
            );
            if (!res.success) {
              setAuthError(res.error || 'Seller registration failed.');
              setLoading(false);
              return;
            }
          } else {
            registerSellerDemo(sellerForm);
          }
        }
      }

      finish(role);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Authentication encountered an error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] glass-panel-solid rounded-3xl border border-glass-border overflow-hidden shadow-2xl">
        {/* Left Informative Panel */}
        <section className="p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-brand-mint/60 via-surface-white/90 to-brand-mint/30 border-b lg:border-b-0 lg:border-r border-glass-border">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Link to="/" className="text-2xl font-display font-extrabold text-brand-forest">
                RePlate.
              </Link>
              <span className="badge badge-mint text-[9px]">2.0 Secure</span>
            </div>

            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-surface-white/80 border border-brand-forest/20 text-brand-forest text-xs font-bold mb-4">
              <Sparkles size={13} />
              <span>{isSupabaseConfigured ? 'Connected to Supabase' : 'Offline / Demo Mode Active'}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary leading-tight mb-4 tracking-tight">
              One marketplace. The right experience for every role.
            </h1>

            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Role permissions are strictly verified at the database layer. Customers, sellers, and administrators enjoy purpose-built workflows with full privacy.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-text-secondary">
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-forest" /> Public discovery open without account
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-forest" /> Database-backed Row-Level Security
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-forest" /> Seller inventory management with image uploads
            </p>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="p-8 md:p-12 bg-surface-white/85">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <span className="eyebrow">{mode === 'sign-in' ? 'Welcome Back' : 'Get Started'}</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary mt-1">
                {mode === 'sign-in' ? 'Sign in to RePlate' : 'Create an Account'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-brand-mint/70 flex items-center justify-center text-brand-forest">
              <Leaf size={22} />
            </div>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'customer'
                  ? 'border-brand-forest bg-brand-forest/10 shadow-sm'
                  : 'border-glass-border bg-surface-white hover:bg-surface-secondary'
              }`}
            >
              <UserRound size={18} className="mb-1 text-brand-forest" />
              <span className="font-bold text-xs block text-text-primary">Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'seller'
                  ? 'border-brand-forest bg-brand-forest/10 shadow-sm'
                  : 'border-glass-border bg-surface-white hover:bg-surface-secondary'
              }`}
            >
              <Building2 size={18} className="mb-1 text-brand-forest" />
              <span className="font-bold text-xs block text-text-primary">Seller</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                role === 'admin'
                  ? 'border-brand-forest bg-brand-forest/10 shadow-sm'
                  : 'border-glass-border bg-surface-white hover:bg-surface-secondary'
              }`}
            >
              <CheckCircle2 size={18} className="mb-1 text-brand-forest" />
              <span className="font-bold text-xs block text-text-primary">Admin</span>
            </button>
          </div>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-accent-coral/70 border border-accent-amber/30 text-accent-amber text-xs font-semibold flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign-up' && role === 'customer' && (
              <>
                <Field
                  label="Full Name"
                  value={customerForm.name}
                  onChange={(val) => updateCustomer('name', val)}
                  placeholder="Jane Doe"
                  required
                />
                <Field
                  label="Phone Number"
                  value={customerForm.phone}
                  onChange={(val) => updateCustomer('phone', val)}
                  placeholder="+91 98765 43210"
                  required
                />
              </>
            )}

            {mode === 'sign-up' && role === 'seller' && (
              <>
                <Field
                  label="Business Name"
                  value={sellerForm.businessName}
                  onChange={(val) => updateSeller('businessName', val)}
                  placeholder="La Petite Boulangerie"
                  required
                />
                <Field
                  label="Owner Name"
                  value={sellerForm.ownerName}
                  onChange={(val) => updateSeller('ownerName', val)}
                  placeholder="Aarav Mehta"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Category"
                    value={sellerForm.category}
                    onChange={(val) => updateSeller('category', val)}
                    placeholder="Bakery"
                    required
                  />
                  <Field
                    label="Phone"
                    value={sellerForm.phone}
                    onChange={(val) => updateSeller('phone', val)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <Field
                  label="Store Address"
                  value={sellerForm.address}
                  onChange={(val) => updateSeller('address', val)}
                  placeholder="12 Market Street"
                  required
                />
              </>
            )}

            <Field
              label="Email Address"
              type="email"
              value={
                mode === 'sign-up'
                  ? role === 'seller'
                    ? sellerForm.email
                    : customerForm.email
                  : role === 'admin'
                  ? 'admin@replate.demo'
                  : role === 'seller'
                  ? sellerForm.email || 'seller@replate.demo'
                  : customerForm.email || 'customer@replate.demo'
              }
              onChange={(val) => (role === 'seller' ? updateSeller('email', val) : updateCustomer('email', val))}
              placeholder="you@example.com"
              required
            />

            <Field
              label="Password"
              type="password"
              value={role === 'seller' ? sellerForm.password : customerForm.password}
              onChange={(val) => (role === 'seller' ? updateSeller('password', val) : updateCustomer('password', val))}
              placeholder="At least 6 characters"
              required={mode === 'sign-up'}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold mt-2 shadow-sm flex items-center justify-center gap-2"
            >
              {loading
                ? 'Authenticating...'
                : mode === 'sign-in'
                ? `Sign In as ${role.toUpperCase()}`
                : `Create ${role.toUpperCase()} Account`}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Switcher helper */}
          {mode === 'sign-in' && !isSupabaseConfigured && (
            <div className="mt-4 p-3 rounded-xl bg-surface-secondary/70 border border-border-emeraldSubtle text-[11px] text-text-secondary">
              <span className="font-bold text-text-primary block mb-0.5">Quick Demo Access:</span>
              Select <span className="font-semibold text-brand-forest">{role}</span> above and click "Sign In". You can also test unverified seller flow by clicking below:
              {role === 'seller' && (
                <button
                  type="button"
                  onClick={() => {
                    signInDemo('seller', 'pending');
                    navigate('/seller/verification', { replace: true });
                  }}
                  className="block mt-1 text-brand-forest font-bold hover:underline"
                >
                  Preview Pending Verification State →
                </button>
              )}
            </div>
          )}

          <p className="text-center text-xs text-text-secondary mt-6">
            {mode === 'sign-in' ? (
              <>
                New to RePlate?{' '}
                <Link to="/auth/sign-up" className="font-bold text-brand-forest hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already registered?{' '}
                <Link to="/auth/sign-in" className="font-bold text-brand-forest hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </section>
      </div>
    </main>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="block text-xs font-semibold text-text-secondary mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-forest/20 shadow-sm"
    />
  </div>
);

export default AuthPage;
