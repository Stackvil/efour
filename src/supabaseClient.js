
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (urlString) => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
}

export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({ select: () => ({ data: [], error: { message: 'Supabase credentials missing' } }), insert: () => ({ error: { message: 'Supabase credentials missing' } }), delete: () => ({ error: { message: 'Supabase credentials missing' } }), update: () => ({ error: { message: 'Supabase credentials missing' } }) }),
        storage: { from: () => ({ upload: () => ({ error: { message: 'Supabase credentials missing' } }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
    };

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('NOTICE: Supabase URL or Key is missing. Rides system running in mock/offline mode.');
}
