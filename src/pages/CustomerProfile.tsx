import { useAuth } from '../context/useAuth';

const CustomerProfile = () => { const { user } = useAuth(); return <div className="bg-surface-white border border-border/70 rounded-2xl p-6 md:p-8"><h2 className="text-2xl font-display font-extrabold mb-2">Profile</h2><p className="text-text-secondary mb-8">Your customer account details.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[['Full name', user?.name], ['Email', user?.email], ['Phone', user?.phone ?? 'Not added'], ['Account type', 'Customer']].map(([label, value]) => <div key={label} className="rounded-xl bg-surface-ivory p-4"><p className="text-xs uppercase tracking-wider text-text-secondary mb-2">{label}</p><p className="font-semibold">{value}</p></div>)}</div><p className="text-xs text-text-secondary mt-8">Demo account data is stored locally. Connect a backend authentication provider before production use.</p></div>; };

export default CustomerProfile;
