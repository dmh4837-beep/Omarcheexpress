import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rduogkbdvbrysixjdxmv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hT1UzyIRJobzFfHax6bmxA_n17JKutV";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
