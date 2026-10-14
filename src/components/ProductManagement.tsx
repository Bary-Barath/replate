import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit3,
  Archive,
  RefreshCw,
  Eye,
  Pause,
  Play,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Package,
  Clock,
  LayoutGrid,
  List,
} from 'lucide-react';
import type { Product } from '../types';
import { useAppContext } from '../context/useAppContext';
import { useAuth } from '../context/useAuth';
import ProductImage from './ProductImage';
import { uploadProductImage, DEFAULT_FALLBACK_IMAGE } from '../lib/supabase';
import { calculateDiscount } from '../utils/discountEngine';

const CATEGORIES = ['All', 'Bakery', 'Fruits & Vegetables', 'Dairy', 'Meals', 'Beverages', 'Snacks', 'Other'];

interface ProductManagementProps {
  sellerOnly?: boolean;
}

export const ProductManagement = ({ sellerOnly = false }: ProductManagementProps) => {
  const { products, createProduct, editProduct, deleteProduct, toggleProductPause, restockProduct } = useAppContext();
  const { user } = useAuth();

  // Filters & Controls
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'sold_out'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'paused'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'deadline'>('newest');

  // Modals & Active Product State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [restockItem, setRestockItem] = useState<{ id: string; name: string; current: number } | null>(null);
  const [restockAmount, setRestockAmount] = useState('5');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);

  // Status feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearMessages = () => {
    setActionSuccess(null);
    setActionError(null);
  };

  // Filter products by seller if in seller mode
  const currentSellerName = user?.businessName || user?.name || 'FreshBake Bakery';
  const relevantProducts = useMemo(() => {
    return products.filter((p) => {
      if (sellerOnly) {
        if (p.sellerId && user?.id) return p.sellerId === user.id;
        return p.sellerName === currentSellerName || p.sellerName === 'FreshBake Bakery';
      }
      return true;
    });
  }, [products, sellerOnly, user, currentSellerName]);

  // Apply search, category, stock and status filters
  const filteredProducts = useMemo(() => {
    return relevantProducts
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase()) ||
          product.sellerName.toLowerCase().includes(search.toLowerCase());

        const matchesCat = selectedCategory === 'All' || product.category === selectedCategory;

        const matchesStock =
          stockFilter === 'all'
            ? true
            : stockFilter === 'in_stock'
            ? product.availableQuantity > 0
            : stockFilter === 'low_stock'
            ? product.availableQuantity > 0 && product.availableQuantity <= 3
            : product.availableQuantity === 0;

        const matchesStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'published'
            ? !product.isPaused && product.availableQuantity > 0
            : Boolean(product.isPaused) || product.availableQuantity === 0;

        return matchesSearch && matchesCat && matchesStock && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.rescuePrice - b.rescuePrice;
        if (sortBy === 'price_desc') return b.rescuePrice - a.rescuePrice;
        if (sortBy === 'deadline') {
          const dA = new Date(a.pickupDeadline || a.bestBefore).getTime();
          const dB = new Date(b.pickupDeadline || b.bestBefore).getTime();
          return dA - dB;
        }
        return b.id.localeCompare(a.id);
      });
  }, [relevantProducts, search, selectedCategory, stockFilter, statusFilter, sortBy]);

  // Handle Quick Toggle Pause / Resume
  const handleTogglePause = async (product: Product) => {
    clearMessages();
    const res = await toggleProductPause(product.id, user?.id || 'demo-seller');
    if (res.success) {
      setActionSuccess(`Listing "${product.name}" is now ${product.isPaused ? 'live' : 'paused'}.`);
    } else {
      setActionError(res.error || 'Failed to update listing status.');
    }
  };

  // Handle Restock
  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem) return;
    clearMessages();
    const amount = parseInt(restockAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setActionError('Please enter a valid restock quantity greater than 0.');
      return;
    }

    const res = await restockProduct(restockItem.id, amount, user?.id || 'demo-seller');
    if (res.success) {
      setActionSuccess(`Added ${amount} units to "${restockItem.name}". Listing is active.`);
      setRestockItem(null);
    } else {
      setActionError(res.error || 'Failed to restock product.');
    }
  };

  // Handle Archive / Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return;
    clearMessages();
    const res = await deleteProduct(deleteConfirmation.id, user?.id || 'demo-seller', false);
    if (res.success) {
      setActionSuccess(`Listing "${deleteConfirmation.name}" has been safely archived from the marketplace.`);
      setDeleteConfirmation(null);
    } else {
      setActionError(res.error || 'Failed to archive listing.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {actionSuccess && (
        <div className="flex items-center justify-between p-4 bg-brand-mint/60 border border-brand-forest/20 rounded-2xl text-brand-deep text-sm font-medium shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-brand-forest shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="p-1 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      {actionError && (
        <div className="flex items-center justify-between p-4 bg-accent-coral/60 border border-accent-amber/20 rounded-2xl text-accent-amber text-sm font-medium shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-accent-amber shrink-0" />
            <span>{actionError}</span>
          </div>
          <button type="button" onClick={() => setActionError(null)} className="p-1 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="glass-panel-solid rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-text-primary">
            {sellerOnly ? 'Inventory & Listings' : 'Platform Product Moderation'}
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Database-backed rescue inventory. Changes persist directly to Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-main rounded-xl p-1 border border-border-emeraldSubtle">
            <button
              type="button"
              aria-label="Table view"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-surface-white text-brand-forest shadow-sm' : 'text-text-secondary'
              }`}
            >
              <List size={18} />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-surface-white text-brand-forest shadow-sm' : 'text-text-secondary'
              }`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              clearMessages();
              setIsAddModalOpen(true);
            }}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={2.5} /> Add Rescue Deal
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search products or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-white/90 border border-glass-border focus:outline-none focus:ring-2 focus:ring-brand-forest/20 text-sm"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-text-secondary" />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-white/90 border border-glass-border rounded-xl px-3 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-surface-white/90 border border-glass-border rounded-xl px-3 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
          >
            <option value="all">Stock: All</option>
            <option value="in_stock">In Stock (&gt;0)</option>
            <option value="low_stock">Low Stock (≤3)</option>
            <option value="sold_out">Sold Out (0)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-surface-white/90 border border-glass-border rounded-xl px-3 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
          >
            <option value="all">Status: All</option>
            <option value="published">Live Only</option>
            <option value="paused">Paused / Sold Out</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary flex items-center gap-1 font-medium">
            <SlidersHorizontal size={13} /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-white/90 border border-glass-border rounded-xl px-3 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
          >
            <option value="newest">Recently Added</option>
            <option value="deadline">Pickup Deadline Soonest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Display (Table or Grid) */}
      {filteredProducts.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center">
          <Package size={40} className="text-text-secondary/60 mb-3" />
          <h3 className="text-lg font-bold text-text-primary mb-1">No products match your criteria</h3>
          <p className="text-sm text-text-secondary max-w-sm mb-6">
            Try adjusting your search terms or clearing your status and stock filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setStockFilter('all');
              setStatusFilter('all');
            }}
            className="btn-secondary text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Responsive Table View */
        <div className="glass-panel-solid rounded-3xl overflow-hidden border border-glass-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-secondary/70 text-text-secondary border-b border-glass-border text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Rescue Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Pickup Deadline</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p) => {
                  const isLive = !p.isPaused && p.availableQuantity > 0;
                  return (
                    <tr key={p.id} className="hover:bg-brand-mint/15 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <ProductImage
                            src={p.imageUrl}
                            alt={p.name}
                            productName={p.name}
                            className="w-12 h-12 rounded-xl shrink-0 border border-glass-border"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-text-primary truncate max-w-[220px]">{p.name}</p>
                            <p className="text-xs text-text-secondary truncate">{p.sellerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-secondary font-medium">{p.category}</td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-brand-forest">₹{p.rescuePrice.toFixed(2)}</span>
                        <span className="text-xs text-text-secondary line-through ml-1.5">
                          ₹{p.originalPrice.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            p.availableQuantity === 0
                              ? 'bg-accent-coral text-accent-amber'
                              : p.availableQuantity <= 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-brand-mint text-brand-forest'
                          }`}
                        >
                          {p.availableQuantity} units
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`badge ${
                            isLive
                              ? 'bg-brand-forest/15 text-brand-forest'
                              : p.availableQuantity === 0
                              ? 'bg-accent-coral text-accent-amber'
                              : 'bg-text-secondary/15 text-text-secondary'
                          }`}
                        >
                          {isLive ? 'Live' : p.availableQuantity === 0 ? 'Sold Out' : 'Paused'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-text-secondary">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock size={12} className="text-brand-forest" />
                          {new Date(p.pickupDeadline || p.bestBefore).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview button */}
                          <button
                            type="button"
                            title="Preview card"
                            onClick={() => setPreviewProduct(p)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-brand-forest hover:bg-surface-white transition-colors"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Pause / Resume */}
                          <button
                            type="button"
                            title={p.isPaused ? 'Resume Listing' : 'Pause Listing'}
                            onClick={() => handleTogglePause(p)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-brand-forest hover:bg-surface-white transition-colors"
                          >
                            {p.isPaused ? <Play size={16} /> : <Pause size={16} />}
                          </button>

                          {/* Restock */}
                          <button
                            type="button"
                            title="Restock units"
                            onClick={() => {
                              clearMessages();
                              setRestockItem({ id: p.id, name: p.name, current: p.availableQuantity });
                              setRestockAmount('5');
                            }}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-brand-forest hover:bg-surface-white transition-colors"
                          >
                            <RefreshCw size={16} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            title="Edit product"
                            onClick={() => {
                              clearMessages();
                              setEditingProduct(p);
                            }}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-brand-forest hover:bg-surface-white transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>

                          {/* Archive */}
                          <button
                            type="button"
                            title="Archive listing"
                            onClick={() => {
                              clearMessages();
                              setDeleteConfirmation({ id: p.id, name: p.name });
                            }}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-accent-critical hover:bg-surface-white transition-colors"
                          >
                            <Archive size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Responsive Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="card p-5 flex flex-col justify-between bg-surface-white/80">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ProductImage
                    src={p.imageUrl}
                    alt={p.name}
                    productName={p.name}
                    className="w-16 h-16 rounded-2xl shrink-0 border border-glass-border"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="badge badge-discount text-[9px] mb-1">{p.discountPercentage}% OFF</span>
                    <h4 className="font-bold text-base text-text-primary leading-tight truncate">{p.name}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">{p.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-surface-secondary/50 rounded-xl p-3 mb-4 border border-border-emeraldSubtle">
                  <div>
                    <span className="text-text-secondary block">Price</span>
                    <span className="font-extrabold text-brand-forest text-sm">₹{p.rescuePrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Available</span>
                    <span className="font-bold text-text-primary text-sm">{p.availableQuantity} left</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border-emeraldSubtle">
                <button
                  type="button"
                  onClick={() => handleTogglePause(p)}
                  className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
                >
                  {p.isPaused ? <Play size={13} /> : <Pause size={13} />}
                  {p.isPaused ? 'Resume' : 'Pause'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Restock"
                    onClick={() => {
                      clearMessages();
                      setRestockItem({ id: p.id, name: p.name, current: p.availableQuantity });
                    }}
                    className="p-2 hover:bg-surface-white rounded-lg text-text-secondary hover:text-brand-forest"
                  >
                    <RefreshCw size={15} />
                  </button>
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => {
                      clearMessages();
                      setEditingProduct(p);
                    }}
                    className="p-2 hover:bg-surface-white rounded-lg text-text-secondary hover:text-brand-forest"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    title="Archive"
                    onClick={() => {
                      clearMessages();
                      setDeleteConfirmation({ id: p.id, name: p.name });
                    }}
                    className="p-2 hover:bg-surface-white rounded-lg text-text-secondary hover:text-accent-critical"
                  >
                    <Archive size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <ProductFormModal
          mode="add"
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={async (data) => {
            setIsSubmitting(true);
            clearMessages();
            const res = await createProduct(data, user?.id);
            setIsSubmitting(false);
            if (res.success) {
              setActionSuccess(`Successfully listed "${data.name}" in the marketplace!`);
              setIsAddModalOpen(false);
            } else {
              setActionError(res.error || 'Failed to create listing');
            }
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <ProductFormModal
          mode="edit"
          initialData={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={async (data) => {
            setIsSubmitting(true);
            clearMessages();
            const res = await editProduct(editingProduct.id, data, user?.id || 'demo-seller');
            setIsSubmitting(false);
            if (res.success) {
              setActionSuccess(`Successfully updated "${data.name}".`);
              setEditingProduct(null);
            } else {
              setActionError(res.error || 'Failed to update listing');
            }
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* RESTOCK MODAL */}
      {restockItem && (
        <div className="fixed inset-0 z-50 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-solid rounded-3xl p-6 max-w-sm w-full animate-scaleIn shadow-2xl">
            <h3 className="font-bold font-display text-lg text-text-primary mb-1">Restock Listing</h3>
            <p className="text-xs text-text-secondary mb-4">
              Add available units for <span className="font-bold text-text-primary">{restockItem.name}</span>.
              (Currently {restockItem.current} in stock)
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Units to add</label>
                <div className="flex gap-2 mb-2">
                  {[2, 5, 10, 20].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setRestockAmount(String(amt))}
                      className={`flex-1 py-1 text-xs rounded-lg font-bold border transition-colors ${
                        restockAmount === String(amt)
                          ? 'bg-brand-forest text-surface-white border-brand-forest'
                          : 'bg-surface-secondary text-text-primary border-glass-border'
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-glass-border bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARCHIVE / DELETE CONFIRMATION MODAL */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-solid rounded-3xl p-6 max-w-md w-full animate-scaleIn shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-accent-coral flex items-center justify-center text-accent-amber mb-4">
              <Archive size={24} />
            </div>
            <h3 className="font-bold font-display text-xl text-text-primary mb-2">Archive Listing</h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-text-primary">{deleteConfirmation.name}</span>?
              It will be unlisted and archived to protect historical customer orders and impact records.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="btn-secondary flex-1 py-2.5 text-xs"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="btn-primary bg-accent-amber hover:bg-amber-800 flex-1 py-2.5 text-xs"
              >
                Archive Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT PREVIEW MODAL */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-solid rounded-3xl p-6 max-w-sm w-full animate-scaleIn shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="eyebrow">Customer Card Preview</span>
              <button type="button" onClick={() => setPreviewProduct(null)} className="p-1 hover:opacity-70">
                <X size={18} />
              </button>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-glass-border">
              <ProductImage
                src={previewProduct.imageUrl}
                alt={previewProduct.name}
                productName={previewProduct.name}
                className="w-full h-full"
              />
              <span className="badge badge-discount absolute top-3 left-3">
                {previewProduct.discountPercentage}% OFF
              </span>
            </div>
            <h4 className="font-bold text-lg text-text-primary mb-1">{previewProduct.name}</h4>
            <p className="text-xs text-text-secondary mb-4">{previewProduct.sellerName} · {previewProduct.category}</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-extrabold text-brand-forest">₹{previewProduct.rescuePrice.toFixed(2)}</span>
              <span className="text-sm text-text-secondary line-through">₹{previewProduct.originalPrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={() => setPreviewProduct(null)}
              className="btn-secondary w-full py-2.5 text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ProductFormModalProps {
  mode: 'add' | 'edit';
  initialData?: Product;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

const ProductFormModal = ({ mode, initialData, onClose, onSubmit, isSubmitting }: ProductFormModalProps) => {
  const { user } = useAuth();

  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Bakery');
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice ? String(initialData.originalPrice) : '');
  const [rescuePrice, setRescuePrice] = useState(initialData?.rescuePrice ? String(initialData.rescuePrice) : '');
  const [minimumPrice, setMinimumPrice] = useState(initialData?.minimumAcceptablePrice ? String(initialData.minimumAcceptablePrice) : '');
  const [quantity, setQuantity] = useState(initialData?.availableQuantity ? String(initialData.availableQuantity) : '5');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || DEFAULT_FALLBACK_IMAGE);
  const [bestBefore, setBestBefore] = useState(() =>
    initialData?.bestBefore
      ? initialData.bestBefore.slice(0, 10)
      : new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
  );
  const [pickupDeadline, setPickupDeadline] = useState(() =>
    initialData?.pickupDeadline
      ? initialData.pickupDeadline.slice(0, 10)
      : new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
  );
  const [collectionLocation, setCollectionLocation] = useState(
    initialData?.collectionLocation || user?.businessAddress || '12 Market Street'
  );
  const [pickupInstructions, setPickupInstructions] = useState(
    initialData?.pickupInstructions || 'Show order code at collection counter.'
  );
  const [allergenInfo, setAllergenInfo] = useState(initialData?.allergenInfo || 'Contains gluten and dairy.');
  const [storageInfo, setStorageInfo] = useState(initialData?.storageInfo || 'Store sealed in a cool, dry place.');

  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-calculate recommendation when original price and dates change
  const orig = parseFloat(originalPrice) || 0;
  const resc = parseFloat(rescuePrice) || 0;
  const calculatedDiscount = orig > 0 && resc > 0 ? Math.round(((orig - resc) / orig) * 100) : 0;

  const handlePriceSuggestion = () => {
    if (orig <= 0) return;
    const rec = calculateDiscount(orig, bestBefore);
    if (rec?.recommendedRescuePrice) {
      setRescuePrice(String(rec.recommendedRescuePrice));
      if (!minimumPrice) setMinimumPrice(String(Math.round(rec.recommendedRescuePrice * 0.85)));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError(null);
    try {
      const res = await uploadProductImage(file);
      if (res.url) {
        setImageUrl(res.url);
      }
    } catch {
      setFormError('Image upload failed. Using fallback asset.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const origNum = parseFloat(originalPrice);
    const rescNum = parseFloat(rescuePrice);
    const qtyNum = parseInt(quantity, 10);
    const minNum = minimumPrice ? parseFloat(minimumPrice) : undefined;

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (isNaN(origNum) || origNum <= 0) {
      setFormError('Original price must be greater than 0.');
      return;
    }
    if (isNaN(rescNum) || rescNum <= 0 || rescNum > origNum) {
      setFormError('Rescue price must be greater than 0 and less than or equal to original price.');
      return;
    }
    if (minNum && minNum > rescNum) {
      setFormError('Minimum seller price cannot exceed the rescue price.');
      return;
    }
    if (isNaN(qtyNum) || qtyNum < 0) {
      setFormError('Available quantity must be positive or zero.');
      return;
    }

    const payload = {
      name: name.trim(),
      sellerName: user?.businessName || user?.name || 'FreshBake Bakery',
      category,
      originalPrice: origNum,
      rescuePrice: rescNum,
      minimumAcceptablePrice: minNum,
      availableQuantity: qtyNum,
      imageUrl,
      bestBefore: new Date(bestBefore).toISOString(),
      pickupDeadline: new Date(pickupDeadline).toISOString(),
      collectionLocation,
      pickupInstructions,
      allergenInfo,
      storageInfo,
      isEligibleForSale: true,
      isPaused: false,
      pathway: 'human' as const,
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel-solid rounded-3xl p-6 md:p-8 max-w-2xl w-full my-8 animate-scaleIn shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-glass-border pb-4">
          <div>
            <span className="eyebrow">{mode === 'add' ? 'New Listing' : 'Edit Listing'}</span>
            <h3 className="font-bold font-display text-2xl text-text-primary">
              {mode === 'add' ? 'Add Rescue Deal' : 'Update Product Information'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-surface-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-accent-coral/70 border border-accent-amber/30 rounded-xl text-accent-amber text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Assorted Croissants (Box of 4)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-secondary/40 p-4 rounded-2xl border border-border-emeraldSubtle">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Original Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="320.00"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-glass-border bg-surface-white text-sm font-semibold"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-text-secondary">Rescue Price (₹) *</label>
                <button
                  type="button"
                  onClick={handlePriceSuggestion}
                  className="text-[10px] text-brand-forest font-bold hover:underline"
                >
                  Suggest
                </button>
              </div>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="128.00"
                value={rescuePrice}
                onChange={(e) => setRescuePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-glass-border bg-surface-white text-sm font-bold text-brand-forest"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Discount %</label>
              <div className="px-3 py-2 rounded-xl bg-surface-white border border-glass-border text-sm font-extrabold text-accent-amber">
                {calculatedDiscount > 0 ? `${calculatedDiscount}% OFF` : '—'}
              </div>
            </div>
          </div>

          {/* Quantity & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Available Quantity *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Best Before Date *</label>
              <input
                type="date"
                required
                value={bestBefore}
                onChange={(e) => setBestBefore(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Pickup Deadline *</label>
              <input
                type="date"
                required
                value={pickupDeadline}
                onChange={(e) => setPickupDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm"
              />
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Product Image</label>
            <div className="flex items-center gap-4">
              <ProductImage
                src={imageUrl}
                alt="Product thumbnail"
                productName={name}
                className="w-16 h-16 rounded-xl shrink-0 border border-glass-border shadow-sm"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="btn-secondary px-3 py-1.5 text-xs cursor-pointer flex items-center gap-1.5">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-[11px] text-text-secondary">JPEG, PNG, WebP up to 5MB</span>
                </div>
                <input
                  type="text"
                  placeholder="Or paste an image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-glass-border bg-surface-white text-xs text-text-secondary"
                />
              </div>
            </div>
          </div>

          {/* Location & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Pickup Location</label>
              <input
                type="text"
                value={collectionLocation}
                onChange={(e) => setCollectionLocation(e.target.value)}
                placeholder="Store address or counter"
                className="w-full px-3.5 py-2 rounded-xl border border-glass-border bg-surface-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Pickup Instructions</label>
              <input
                type="text"
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                placeholder="e.g. Show order confirmation code"
                className="w-full px-3.5 py-2 rounded-xl border border-glass-border bg-surface-white text-xs"
              />
            </div>
          </div>

          {/* Food Safety & Allergen Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Allergen Information</label>
              <input
                type="text"
                value={allergenInfo}
                onChange={(e) => setAllergenInfo(e.target.value)}
                placeholder="e.g. Contains dairy, eggs, wheat"
                className="w-full px-3.5 py-2 rounded-xl border border-glass-border bg-surface-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Storage Instructions</label>
              <input
                type="text"
                value={storageInfo}
                onChange={(e) => setStorageInfo(e.target.value)}
                placeholder="e.g. Keep chilled below 4°C"
                className="w-full px-3.5 py-2 rounded-xl border border-glass-border bg-surface-white text-xs"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-4 pt-4 border-t border-glass-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary flex-1 py-3 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="btn-primary flex-1 py-3 text-sm"
            >
              {isSubmitting ? 'Saving to Database...' : mode === 'add' ? 'Publish Listing' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
