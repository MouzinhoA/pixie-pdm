import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const urlSupabase = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chavePublicaSupabase = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!urlSupabase || !chavePublicaSupabase) {
  throw new Error(
    'Variáveis do Supabase ausentes. Crie o arquivo .env.local com EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(urlSupabase, chavePublicaSupabase, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (estado) => {
    if (estado === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
