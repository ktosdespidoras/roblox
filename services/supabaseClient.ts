import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctlzeusfuqlypjzfcgkt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bHpldXNmdXFseXBqemZjZ2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODcwMTMsImV4cCI6MjA3OTY2MzAxM30.klhEiHoT3scoss5gDJudLJ7hZAHPwJeqpeFoTor1P88';

export const supabase = createClient(supabaseUrl, supabaseKey);