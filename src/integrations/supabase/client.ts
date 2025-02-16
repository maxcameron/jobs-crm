
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://boibtyufrcuruntqgeoq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvaWJ0eXVmcmN1cnVudHFnZW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NzcwMjgsImV4cCI6MjA1NTE1MzAyOH0.tZxmRCr9S6T45tPlaGkEX4k5WxFNI1XFWqB7Qv8cj1s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
