import type { SQLiteDatabase } from 'expo-sqlite';

export type PreferenciaTema = 'light' | 'dark' | 'system';

export async function lerPreferenciaTema(db: SQLiteDatabase): Promise<PreferenciaTema> {
  const linha = await db.getFirstAsync<{ valor: string }>(
    "SELECT valor FROM configuracoes WHERE chave = 'tema'"
  );
  return linha?.valor === 'light' || linha?.valor === 'dark' ? linha.valor : 'system';
}

export async function salvarPreferenciaTema(db: SQLiteDatabase, preferencia: PreferenciaTema) {
  await db.runAsync("INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES ('tema', ?)", [preferencia]);
}
