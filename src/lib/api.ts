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
  pickup_time?: string;
  pax?: string;
  details?: string;
  status?: string;
}

export interface Booking extends BookingInput {
  id: string;
  status: string;
  created_at: string;
}

export async function createBooking(booking: BookingInput): Promise<{
  data: Booking | null;
  error: any;
}> {
  const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
  if (error) {
    console.error('Error creating booking:', error);
    return { data: null, error };
  }
  return { data: data as Booking, error: null };
}

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (error || !data) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data as Booking[];
}

export async function updateBookingStatus(id: string, status: string): Promise<{
  data: Booking | null;
  error: any;
}> {
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
  if (error) {
    console.error('Error updating booking status:', error);
    return { data: null, error };
  }
  return { data: data as Booking, error: null };
}

export async function deleteBooking(id: string): Promise<{ error: any }> {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) {
    console.error('Error deleting booking:', error);
    return { error };
  }
  return { error: null };
}
