
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://boibtyufrcuruntqgeoq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvaWJ0eXVmcmN1cnVudHFnZW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2ODQxODQsImV4cCI6MjA1NTI2MDE4NH0.n8KYRnG6T8tP3_wH-fF5Iu5wFXiBFjg-eVMN2shf4UE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
