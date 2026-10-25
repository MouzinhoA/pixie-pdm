import type { SQLiteDatabase } from 'expo-sqlite';

export const NOME_BANCO = 'pixie-comprador.db';

export async function iniciarBanco(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON');

  await db.withTransactionAsync(async () => {
    await criarTabelas(db);

    const produtos = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM produtos');
    if (produtos?.total === 0) {
      await inserirDadosIniciais(db);
    }
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

async function inserirDadosIniciais(db: SQLiteDatabase) {
  await db.execAsync(`
    INSERT INTO usuarios (nome, cidade, telefone, reputacao) VALUES
      ('Loja Nerd Retrô', 'João Pessoa - PB', '(83) 98888-1111', 4.8),
      ('Ana Moedas Raras', 'Recife - PE', '(81) 97777-2222', 4.5),
      ('Gibiteca do Zé', 'Campina Grande - PB', '(83) 96666-3333', 4.9);

    INSERT INTO categorias (nome) VALUES
      ('Cartas colecionáveis'),
      ('Action figures'),
      ('Moedas e cédulas'),
      ('Quadrinhos'),
      ('Discos de vinil'),
      ('Brinquedos antigos'),
      ('Selos'),
      ('Outros');
  `);

  const produtos = [
    ['Carta de dragão colecionável', 'Carta holográfica de dragão, edição limitada, guardada em sleeve desde a compra.', 85, 'usado', 'disponivel', 1, 1],
    ['Carta Charizard 1ª edição', 'Carta da coleção base, cantos perfeitos e brilho intacto.', 2500, 'usado', 'disponivel', 1, 1],
    ['Action figure Goku SSJ', 'Figura S.H. Figuarts original, ainda lacrada na caixa.', 450, 'lacrado', 'disponivel', 2, 1],
    ['Boneco He-Man anos 80', 'Figura original da Estrela, com espada e escudo. Pequenos sinais de uso.', 380, 'com_avarias', 'reservado', 6, 1],
    ['Moeda 1 real Beija-flor 1999', 'Moeda comemorativa em ótimo estado de conservação.', 120, 'usado', 'disponivel', 3, 2],
    ['Cédula 500 cruzeiros 1972', 'Cédula antiga sem dobras, ideal para quem coleciona notas.', 75.5, 'usado', 'disponivel', 3, 2],
    ['Selo Olho de Boi (réplica)', 'Réplica oficial do primeiro selo do Brasil, em moldura.', 40, 'novo', 'disponivel', 7, 2],
    ['Vinil Clube da Esquina', 'Disco original de 1972, capa dupla, toca perfeitamente.', 290, 'usado', 'vendido', 5, 2],
    ['Gibi Turma da Mônica nº 1', 'Edição número 1, páginas amareladas, sem rasgos.', 900, 'usado', 'disponivel', 4, 3],
    ['Coleção Sandman completa', 'Os 10 volumes da edição encadernada, como novos.', 650, 'novo', 'disponivel', 4, 3],
    ['Carrinho Hot Wheels 1995', 'Modelo raro, ainda na embalagem original.', 60, 'lacrado', 'disponivel', 6, 3],
    ['Vinil Legião Urbana - Dois', 'Primeira prensagem de 1986, capa com pequeno desgaste.', 180, 'usado', 'disponivel', 5, 3],
  ] as const;

  for (const [indice, produto] of produtos.entries()) {
    const [titulo, descricao, preco, condicao, status, categoriaId, vendedorId] = produto;
    const criadoEm = new Date(Date.now() - indice * 60 * 60 * 1000).toISOString();

    await db.runAsync(
      `INSERT INTO produtos (titulo, descricao, preco, condicao, status, categoriaId, vendedorId, criadoEm)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descricao, preco, condicao, status, categoriaId, vendedorId, criadoEm]
    );
  }
}
