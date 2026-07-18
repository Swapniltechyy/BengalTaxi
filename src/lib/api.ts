import { supabase } from './supabase';

export async function getSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  
  // Convert array of {key, value} to an object
  return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
}

export async function getRoutes() {
  const { data, error } = await supabase.from('routes').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getVehicles() {
  const { data, error } = await supabase.from('vehicles').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getServices() {
  const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getReviews() {
  const { data, error } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getFeatures() {
  const { data, error } = await supabase.from('features').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getWhyChooseUs() {
  const { data, error } = await supabase.from('why_choose_us').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAboutContent() {
  const { data, error } = await supabase.from('about_content').select('*');
  if (error) throw error;
  
  // Convert array to object
  return data.reduce((acc, row) => ({ ...acc, [row.section]: row.content }), {});
}
