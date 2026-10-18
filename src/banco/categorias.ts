import type { SQLiteDatabase } from 'expo-sqlite';

import type { Categoria } from '@/modelos';

export async function listarCategorias(db: SQLiteDatabase) {
  return db.getAllAsync<Categoria>('SELECT * FROM categorias ORDER BY id');
}
