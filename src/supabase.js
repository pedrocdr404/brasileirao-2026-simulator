import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cciiiooccnfmkdpdcyuc.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_KObnlzEBRtviRO8K2EPceA_Ki-cuWov'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)