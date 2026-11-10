import type { SQLiteDatabase } from 'expo-sqlite';

export const NOME_BANCO = 'pixie-comprador.db';

export async function iniciarBanco(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON');

  await db.withTransactionAsync(async () => {
    await criarTabelas(db);
  });
}

async function criarTabelas(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cidade TEXT NOT NULL,
      telefone TEXT NOT NULL,
      reputacao REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      preco REAL NOT NULL CHECK (preco > 0),
      condicao TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'disponivel',
      categoriaId INTEGER NOT NULL REFERENCES categorias(id),
      vendedorId INTEGER NOT NULL REFERENCES usuarios(id),
      criadoEm TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS interesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produtoId INTEGER NOT NULL UNIQUE REFERENCES produtos(id) ON DELETE CASCADE,
      tipo TEXT NOT NULL CHECK (tipo IN ('compra', 'troca')),
      valorOferecido REAL CHECK (valorOferecido IS NULL OR valorOferecido > 0),
      itemTroca TEXT NOT NULL DEFAULT '',
      mensagem TEXT NOT NULL CHECK (length(mensagem) BETWEEN 10 AND 300),
      status TEXT NOT NULL DEFAULT 'aguardando'
        CHECK (status IN ('aguardando', 'negociando', 'encerrado')),
      criadoEm TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS configuracoes (
      chave TEXT PRIMARY KEY,
      valor TEXT NOT NULL
    );
  `);
}
