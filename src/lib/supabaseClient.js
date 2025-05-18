
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntjaryaobhxmhsiyynyy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50amFyeWFvYmh4bWhzaXl5bnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDgxMDQsImV4cCI6MjA2MjIyNDEwNH0._nBr0VrBjxr05mmkZqCrnbLeGBY6h1NtsckyOh_lie0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
