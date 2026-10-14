import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { User, Phone, Mail, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);
    const res = await updateProfile({ name: name.trim(), phone: phone.trim() });
    setIsSaving(false);
    if (res.success) {
      setMsg({ type: 'success', text: 'Profile updated successfully.' });
    } else {
      setMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  return (
    <div className="glass-panel-solid rounded-3xl border border-glass-border p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <span className="eyebrow">Account Settings</span>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">Profile</h2>
        <p className="text-xs text-text-secondary mt-1">Your verified customer identity and contact details.</p>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-brand-mint text-brand-forest border border-brand-forest/20'
              : 'bg-accent-coral text-accent-amber border border-accent-amber/20'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-lg mb-8">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
            />
            <User size={15} className="absolute left-3 top-2.5 text-text-secondary" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-secondary/60 text-xs font-medium text-text-secondary cursor-not-allowed"
            />
            <Mail size={15} className="absolute left-3 top-2.5 text-text-secondary" />
          </div>
          <span className="text-[10px] text-text-secondary mt-1 block">
            Email is your verified login identity and cannot be edited directly.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
            />
            <Phone size={15} className="absolute left-3 top-2.5 text-text-secondary" />
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="btn-primary text-xs py-2.5 px-6">
          {isSaving ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </form>

      <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border-emeraldSubtle flex items-center gap-3 text-xs text-text-secondary">
        <ShieldCheck size={18} className="text-brand-forest shrink-0" />
        <span>
          Role: <strong className="text-text-primary capitalize">{user?.role || 'customer'}</strong>. Role privilege
          is securely determined by PostgreSQL row-level security.
        </span>
      </div>
    </div>
  );
};

export default CustomerProfile;
