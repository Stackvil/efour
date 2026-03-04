
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.log('Supabase credentials missing or placeholders.');
    process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRides() {
    const { data, error } = await supabase
        .from('rides')
        .select('category, name')
        .eq('category', 'food');

    if (error) {
        console.error('Error fetching rides:', error);
    } else {
        console.log('Food items found in rides table:', data.length);
        if (data.length > 0) {
            console.log('Sample:', data[0]);
        }
    }
}

checkRides();
