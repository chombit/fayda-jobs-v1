
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing fetchJobs...");
  const { data, error, count } = await supabase
    .from('jobs')
    .select('*, companies(*), categories(*)', { count: 'exact' });
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Count:", count);
    console.log("Data sample:", data?.slice(0, 1));
  }
}

test();
