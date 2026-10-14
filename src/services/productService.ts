import { supabase, isSupabaseConfigured, resolveProductImageUrl } from '../lib/supabase';
import type { Product, CartItem, CustomerInfo, Order } from '../types';
import { mockProducts } from '../mockData';

// Helper to map DB row to frontend Product model
export const mapDbProductToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  sellerName: row.seller_name,
  sellerId: row.seller_id,
  originalPrice: Number(row.original_price),
  rescuePrice: Number(row.rescue_price),
  discountPercentage: row.discount_percentage ?? Math.round(((row.original_price - row.rescue_price) / row.original_price) * 100),
  bestBefore: row.best_before,
  pickupDeadline: row.pickup_deadline,
  availableQuantity: Number(row.available_quantity),
  imageUrl: resolveProductImageUrl(row.image_url || row.image_storage_path, row.name),
  category: row.category,
  distance: row.distance || '1.2 km',
  isEligibleForSale: Boolean(row.is_eligible_for_sale),
  isPaused: Boolean(row.is_paused),
  pathway: row.pathway || 'human',
  collectionLocation: row.collection_location,
  pickupInstructions: row.pickup_instructions,
  allergenInfo: row.allergen_info,
  storageInfo: row.storage_info,
  minimumAcceptablePrice: row.minimum_acceptable_price ? Number(row.minimum_acceptable_price) : undefined,
  availableWeightKg: row.available_weight_kg ? Number(row.available_weight_kg) : undefined,
});

/**
 * Fetch products from Supabase database if configured,
 * otherwise fall back to verified mock products.
 */
export const getProducts = async (): Promise<Product[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getProducts error:', error.message);
        return mockProducts;
      }

      if (data && data.length > 0) {
        return data.map(mapDbProductToProduct);
      }
    } catch (err) {
      console.warn('Failed to query Supabase products:', err);
    }
  }

  return mockProducts;
};

/**
 * Create a new product in Supabase
 */
export const insertProduct = async (
  product: Omit<Product, 'id' | 'discountPercentage'>,
  userId?: string
): Promise<{ product?: Product; error?: string }> => {
  const discount = Math.round(
    ((product.originalPrice - product.rescuePrice) / product.originalPrice) * 100
  );

  const newId = `p-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const mappedProduct: Product = {
    ...product,
    id: newId,
    discountPercentage: discount,
    imageUrl: resolveProductImageUrl(product.imageUrl, product.name),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const dbPayload = {
        name: product.name,
        seller_name: product.sellerName,
        seller_id: userId || null,
        category: product.category,
        original_price: product.originalPrice,
        rescue_price: product.rescuePrice,
        minimum_acceptable_price: product.minimumAcceptablePrice || null,
        available_quantity: product.availableQuantity,
        available_weight_kg: product.availableWeightKg || null,
        image_url: mappedProduct.imageUrl,
        best_before: product.bestBefore,
        pickup_deadline: product.pickupDeadline || product.bestBefore,
        collection_location: product.collectionLocation || `${product.sellerName} · Local Store`,
        pickup_instructions: product.pickupInstructions || 'Show order code at pickup.',
        allergen_info: product.allergenInfo || 'None declared',
        storage_info: product.storageInfo || 'Store according to label',
        is_eligible_for_sale: product.isEligibleForSale !== false,
        is_paused: Boolean(product.isPaused),
        status: product.isPaused ? 'draft' : 'published',
        pathway: product.pathway || 'human',
      };

      const { data, error } = await supabase
        .from('products')
        .insert(dbPayload)
        .select()
        .single();

      if (error) {
        console.error('Failed to insert product in Supabase:', error.message);
        return { error: error.message };
      }

      return { product: mapDbProductToProduct(data) };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database insert failed';
      return { error: msg };
    }
  }

  // Local fallback
  return { product: mappedProduct };
};

/**
 * Update an existing product in Supabase
 */
export const updateProductDb = async (
  productId: string,
  updates: Partial<Product>,
  _userId?: string
): Promise<{ product?: Product; error?: string }> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
      if (updates.rescuePrice !== undefined) dbUpdates.rescue_price = updates.rescuePrice;
      if (updates.minimumAcceptablePrice !== undefined) dbUpdates.minimum_acceptable_price = updates.minimumAcceptablePrice;
      if (updates.availableQuantity !== undefined) {
        dbUpdates.available_quantity = updates.availableQuantity;
        if (updates.availableQuantity === 0) dbUpdates.status = 'sold_out';
      }
      if (updates.imageUrl !== undefined) {
        dbUpdates.image_url = resolveProductImageUrl(updates.imageUrl, updates.name);
      }
      if (updates.bestBefore !== undefined) dbUpdates.best_before = updates.bestBefore;
      if (updates.pickupDeadline !== undefined) dbUpdates.pickup_deadline = updates.pickupDeadline;
      if (updates.collectionLocation !== undefined) dbUpdates.collection_location = updates.collectionLocation;
      if (updates.pickupInstructions !== undefined) dbUpdates.pickup_instructions = updates.pickupInstructions;
      if (updates.allergenInfo !== undefined) dbUpdates.allergen_info = updates.allergenInfo;
      if (updates.storageInfo !== undefined) dbUpdates.storage_info = updates.storageInfo;
      if (updates.isPaused !== undefined) {
        dbUpdates.is_paused = updates.isPaused;
        dbUpdates.status = updates.isPaused ? 'draft' : 'published';
      }
      if (updates.isEligibleForSale !== undefined) dbUpdates.is_eligible_for_sale = updates.isEligibleForSale;

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { product: mapDbProductToProduct(data) };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database update failed';
      return { error: msg };
    }
  }

  return { product: { ...updates, id: productId } as Product };
};

/**
 * Archive or delete product safely
 */
export const archiveOrDeleteProduct = async (
  productId: string,
  _userId?: string,
  hardDelete = false
): Promise<{ success: boolean; error?: string }> => {
  if (isSupabaseConfigured && supabase) {
    try {
      if (!hardDelete) {
        // Safe archival
        const { error } = await supabase
          .from('products')
          .update({ status: 'archived', is_paused: true, updated_at: new Date().toISOString() })
          .eq('id', productId);

        if (error) return { success: false, error: error.message };
        return { success: true };
      }

      // Hard delete if allowed by foreign keys
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Archive failed';
      return { success: false, error: msg };
    }
  }

  return { success: true };
};

/**
 * Execute atomic checkout / order placement
 */
export const executeAtomicOrder = async (
  customer: CustomerInfo,
  cart: CartItem[],
  subtotal: number,
  platformFee: number,
  total: number,
  _userId?: string
): Promise<{ order?: Order; error?: string }> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const itemsPayload = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      // Call database RPC
      const { data, error } = await supabase.rpc('place_order_atomic', {
        p_customer_name: customer.name,
        p_customer_email: customer.email,
        p_customer_phone: customer.phone,
        p_pickup_preference: customer.pickupPreference || 'standard',
        p_items: itemsPayload,
      });

      if (error) {
        return { error: error.message };
      }

      const createdOrder: Order = {
        id: data.order_number || `RP-${Date.now().toString(36).toUpperCase()}`,
        items: cart,
        customer,
        subtotal: Number(data.subtotal || subtotal),
        platformFee: Number(data.platform_fee || platformFee),
        total: Number(data.total || total),
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };

      return { order: createdOrder };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order submission error';
      return { error: msg };
    }
  }

  // Local atomic simulation
  const orderId = `RP-${Date.now().toString(36).toUpperCase()}`;
  return {
    order: {
      id: orderId,
      items: cart,
      customer,
      subtotal,
      platformFee,
      total,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    },
  };
};
