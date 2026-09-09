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
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // ignore
  }
}

export async function createBooking(booking: BookingInput) {
  const newBooking: Booking = {
    ...booking,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `b_${Date.now()}`,
    status: booking.status || 'pending',
    created_at: new Date().toISOString(),
  };

  // 1. Always store locally first so it is never lost
  const localList = getLocalBookings();
  saveLocalBookings([newBooking, ...localList.filter((b) => b.id !== newBooking.id)]);

  // 2. Insert into Supabase
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();

    if (!error && data) {
      // Update local storage with Supabase record
      const updatedList = getLocalBookings().map((b) => (b.id === newBooking.id ? (data as Booking) : b));
      saveLocalBookings(updatedList);
      return { data: data as Booking, error: null };
    }
    if (error) {
      console.warn('Supabase booking insert (using local fallback):', error.message);
    }
  } catch (err: any) {
    console.warn('Supabase insert exception:', err);
  }

  return { data: newBooking, error: null };
}

export async function getBookings(): Promise<Booking[]> {
  const localBookings = getLocalBookings();

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Merge Supabase bookings with any local bookings
      const supabaseIds = new Set(data.map((b: any) => b.id));
      const unsynced = localBookings.filter((b) => !supabaseIds.has(b.id));

      // Return unified list
      return [...unsynced, ...data] as Booking[];
    }
  } catch (err) {
    console.warn('Could not fetch bookings from Supabase:', err);
  }

  return localBookings;
}

export async function updateBookingStatus(id: string, status: string) {
  const localList = getLocalBookings();
  const updatedLocal = localList.map((b) => (b.id === id ? { ...b, status } : b));
  saveLocalBookings(updatedLocal);

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return { data, error: null };
    }
  } catch (e) {
    // ignore
  }

  return { data: { id, status }, error: null };
}

export async function deleteBooking(id: string) {
  const localList = getLocalBookings();
  const filtered = localList.filter((b) => b.id !== id);
  saveLocalBookings(filtered);

  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Delete from Supabase warning:', error.message);
    }
  } catch (err) {
    console.warn('Delete exception:', err);
  }

  return { error: null };
}


