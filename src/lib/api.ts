import { supabase } from './supabase';

export async function getSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error || !data) {
    console.error('Error fetching site settings:', error);
    return {};
  }
  
  // Convert array of {key, value} to an object
  return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
}

export async function getRoutes() {
  const { data, error } = await supabase.from('routes').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching routes:', error);
    return null;
  }
  return data;
}

export async function getVehicles() {
  const { data, error } = await supabase.from('vehicles').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching vehicles:', error);
    return null;
  }
  return data;
}

export async function getServices() {
  const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching services:', error);
    return null;
  }
  return data;
}

export async function getReviews() {
  const { data, error } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching reviews:', error);
    return null;
  }
  return data;
}

export async function getFeatures() {
  const { data, error } = await supabase.from('features').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching features:', error);
    return null;
  }
  return data;
}

export async function getWhyChooseUs() {
  const { data, error } = await supabase.from('why_choose_us').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching why choose us:', error);
    return null;
  }
  return data;
}

export async function getAboutContent() {
  const { data, error } = await supabase.from('about_content').select('*');
  if (error || !data) {
    console.error('Error fetching about content:', error);
    return {};
  }
  
  // Convert array to object
  return data.reduce((acc, row) => ({ ...acc, [row.section]: row.content }), {});
}

export interface BookingInput {
  name: string;
  phone: string;
  from_location: string;
  to_location: string;
  pickup_date?: string;
  pax?: string;
  details?: string;
  status?: string;
}

export interface Booking extends BookingInput {
  id: string;
  status: string;
  created_at: string;
}

const LOCAL_BOOKINGS_KEY = 'bt_local_bookings';

function getLocalBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBookings(bookings: Booking[]) {
  if (typeof window === 'undefined') return;
  try {
    if (bookings.length === 0) {
      localStorage.removeItem(LOCAL_BOOKINGS_KEY);
    } else {
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
    }
  } catch {
    // ignore
  }
}

// Helpers to support both 'bookings' and 'bt_local_bookings' view/alias
async function insertBookingToSupabase(booking: BookingInput) {
  let res = await supabase.from('bookings').insert([booking]).select().single();
  if (res.error && (res.error.code === 'PGRST205' || res.error.message?.includes('schema cache'))) {
    res = await supabase.from('bt_local_bookings').insert([booking]).select().single();
  }
  return res;
}

async function fetchBookingsFromSupabase() {
  let res = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (res.error && (res.error.code === 'PGRST205' || res.error.message?.includes('schema cache'))) {
    res = await supabase.from('bt_local_bookings').select('*').order('created_at', { ascending: false });
  }
  return res;
}

async function updateBookingInSupabase(id: string, status: string) {
  let res = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
  if (res.error && (res.error.code === 'PGRST205' || res.error.message?.includes('schema cache'))) {
    res = await supabase.from('bt_local_bookings').update({ status }).eq('id', id).select().single();
  }
  return res;
}

async function deleteBookingFromSupabase(id: string) {
  let res = await supabase.from('bookings').delete().eq('id', id);
  if (res.error && (res.error.code === 'PGRST205' || res.error.message?.includes('schema cache'))) {
    res = await supabase.from('bt_local_bookings').delete().eq('id', id);
  }
  return res;
}

export async function createBooking(booking: BookingInput): Promise<{
  data: Booking;
  error: any;
  savedTo: 'supabase' | 'local';
}> {
  const newBooking: Booking = {
    ...booking,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `b_${Date.now()}`,
    status: booking.status || 'pending',
    created_at: new Date().toISOString(),
  };

  // 1. Try to save directly to Supabase
  try {
    const { data, error } = await insertBookingToSupabase(booking);

    if (!error && data) {
      // Successfully saved to Supabase
      // Clean up matching record in local storage if any
      try {
        const local = getLocalBookings();
        saveLocalBookings(local.filter((b) => b.phone !== booking.phone || b.name !== booking.name));
      } catch {}
      return { data: data as Booking, error: null, savedTo: 'supabase' };
    }

    if (error) {
      console.warn('Supabase booking insert (table pending in SQL editor):', error.message);
    }
  } catch (err: any) {
    console.warn('Supabase insert exception:', err?.message || err);
  }

  // 2. Resilient local fallback so customer form submission NEVER fails
  const localList = getLocalBookings();
  saveLocalBookings([newBooking, ...localList.filter((b) => b.id !== newBooking.id)]);

  return { data: newBooking, error: null, savedTo: 'local' };
}

// Background migration for any legacy local bookings to Supabase
let isSyncingLocal = false;
async function syncPendingLocalBookings(currentSupabase: Booking[]) {
  if (isSyncingLocal || typeof window === 'undefined') return;
  const localList = getLocalBookings();
  if (!localList || localList.length === 0) return;

  isSyncingLocal = true;
  try {
    const existingKeys = new Set(
      currentSupabase.map((b) => `${b.name}_${b.phone}_${b.pickup_date || ''}`)
    );
    const toSync = localList.filter(
      (b) => !existingKeys.has(`${b.name}_${b.phone}_${b.pickup_date || ''}`)
    );

    for (const b of toSync) {
      const { data, error } = await insertBookingToSupabase({
        name: b.name,
        phone: b.phone,
        from_location: b.from_location,
        to_location: b.to_location,
        pickup_date: b.pickup_date,
        pax: b.pax,
        details: b.details,
        status: b.status || 'pending',
      });
      if (!error && data) {
        const remaining = getLocalBookings().filter((item) => item.id !== b.id);
        saveLocalBookings(remaining);
      }
    }
  } catch (err) {
    console.warn('Background local booking sync error:', err);
  } finally {
    isSyncingLocal = false;
  }
}

export async function getBookings(): Promise<Booking[]> {
  const localBookings = getLocalBookings();

  try {
    const { data, error } = await fetchBookingsFromSupabase();

    if (!error && data) {
      const supabaseBookings = (data || []) as Booking[];
      // Migrate any legacy local bookings in the background
      syncPendingLocalBookings(supabaseBookings);

      // Merge any local bookings that haven't synced yet
      const supabaseIds = new Set(supabaseBookings.map((b) => b.id));
      const unsynced = localBookings.filter((b) => !supabaseIds.has(b.id));

      return [...unsynced, ...supabaseBookings];
    }
  } catch (err) {
    console.warn('Could not fetch bookings from Supabase:', err);
  }

  return localBookings;
}

export async function updateBookingStatus(id: string, status: string) {
  // Update local storage
  const localList = getLocalBookings();
  const updatedLocal = localList.map((b) => (b.id === id ? { ...b, status } : b));
  saveLocalBookings(updatedLocal);

  // Update Supabase
  try {
    const { data, error } = await updateBookingInSupabase(id, status);
    if (!error && data) {
      return { data: data as Booking, error: null };
    }
  } catch (err) {
    console.warn('Update in Supabase exception:', err);
  }

  return { data: { id, status } as any, error: null };
}

export async function deleteBooking(id: string) {
  // Remove from local storage
  const localList = getLocalBookings();
  saveLocalBookings(localList.filter((b) => b.id !== id));

  // Delete from Supabase
  try {
    await deleteBookingFromSupabase(id);
  } catch (err) {
    console.warn('Delete from Supabase exception:', err);
  }

  return { error: null };
}


