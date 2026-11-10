import 'expo-sqlite/localStorage/install';

export type PreferenciaTema = 'light' | 'dark' | 'system';

const CHAVE_TEMA = 'pixie:tema';

export function lerPreferenciaTema(): PreferenciaTema {
  try {
    const valor = localStorage.getItem(CHAVE_TEMA);
    return valor === 'light' || valor === 'dark' ? valor : 'system';
  } catch {
    return 'system';
  }
}

export function salvarPreferenciaTema(preferencia: PreferenciaTema) {
  try {
    localStorage.setItem(CHAVE_TEMA, preferencia);
  } catch {
  }
}
