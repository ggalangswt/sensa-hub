import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "missing-service-role-key";

// Route handlers use the service role client. Local builds should still compile
// before real Supabase credentials are configured.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
