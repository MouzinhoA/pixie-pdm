import type { SQLiteDatabase } from 'expo-sqlite';

// "system" = segue o tema do celular
export type PreferenciaTema = 'light' | 'dark' | 'system';

export async function lerPreferenciaTema(db: SQLiteDatabase): Promise<PreferenciaTema> {
  const linha = await db.getFirstAsync<{ valor: string }>(
    "SELECT valor FROM configuracoes WHERE chave = 'tema'"
  );
  return linha?.valor === 'light' || linha?.valor === 'dark' ? linha.valor : 'system';
}

export async function salvarPreferenciaTema(db: SQLiteDatabase, preferencia: PreferenciaTema) {
  // INSERT OR REPLACE: cria a linha na primeira vez e atualiza nas próximas
  await db.runAsync("INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES ('tema', ?)", [preferencia]);
}
