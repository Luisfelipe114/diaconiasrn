/**
 * lib/db.js
 * Conexão com o banco de dados.
 * - Em desenvolvimento local: usa arquivo SQLite local (file:local.db)
 * - Em produção (Vercel): usa Turso (SQLite na nuvem)
 */
import { createClient } from '@libsql/client';

let client;

function getClient() {
  if (!client) {
    client = createClient({
      url:       process.env.TURSO_DATABASE_URL || 'file:local.db',
      authToken: process.env.TURSO_AUTH_TOKEN   || undefined,
    });
  }
  return client;
}

// ─────────────────────────────────────────
// INICIALIZAÇÃO DO BANCO
// ─────────────────────────────────────────

/**
 * Inicializa o banco criando as tabelas se não existirem
 * e semeando o usuário padrão definido nas variáveis de ambiente.
 */
export async function initDb() {
  const db = getClient();

  // Tabela de comprovantes de dízimo
  await db.execute(`
    CREATE TABLE IF NOT EXISTS comprovantes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT    NOT NULL,
      nascimento TEXT,
      foto_url   TEXT,
      criado_em  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
      observacao TEXT
    )
  `);

  // Tabela de usuários administrativos
  await db.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT    NOT NULL,
      email      TEXT    NOT NULL UNIQUE,
      senha_hash TEXT    NOT NULL,
      criado_em  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `);

  // Semeia o usuário padrão definido nas envs (apenas se não existir)
  await seedUsuarioPadrao();
}

/**
 * Cria o usuário administrador padrão a partir das variáveis de ambiente,
 * mas APENAS se ainda não existir nenhum usuário com aquele email.
 */
async function seedUsuarioPadrao() {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const senha = process.env.DEFAULT_ADMIN_PASSWORD;
  const nome  = process.env.DEFAULT_ADMIN_NOME || 'Administrador';

  if (!email || !senha) return; // sem env configurada, não faz nada

  const existente = await buscarUsuarioPorEmail(email);
  if (existente) return; // já existe, não recria

  // bcryptjs: import dinâmico para não quebrar o Edge Runtime
  // (esta função só é chamada de rotas Node.js, então é seguro)
  const bcrypt = await import('bcryptjs');
  const hash   = await bcrypt.hash(senha, 12); // 12 rounds = seguro e não muito lento

  await inserirUsuario({ nome, email, senha_hash: hash });
  console.log(`[DB] Usuário padrão criado: ${email}`);
}

// ─────────────────────────────────────────
// COMPROVANTES
// ─────────────────────────────────────────

export async function inserirComprovante(dados) {
  const db = getClient();
  const result = await db.execute({
    sql: `INSERT INTO comprovantes (nome, nascimento, foto_url, observacao)
          VALUES (:nome, :nascimento, :foto_url, :observacao)`,
    args: {
      nome:       dados.nome,
      nascimento: dados.nascimento || null,
      foto_url:   dados.foto_url   || null,
      observacao: dados.observacao || null,
    },
  });
  return result.lastInsertRowid;
}

export async function listarComprovantes() {
  const db = getClient();
  const result = await db.execute(
    'SELECT * FROM comprovantes ORDER BY criado_em DESC'
  );
  
  // O libsql retorna protótipos próprios e BigInts. 
  // Precisamos converter para objetos puros do JS para o Next.js aceitar no Server Component.
  return result.rows.map(row => ({
    id:         Number(row.id),
    nome:       row.nome,
    nascimento: row.nascimento,
    foto_url:   row.foto_url,
    criado_em:  row.criado_em,
    observacao: row.observacao
  }));
}

export async function buscarComprovante(id) {
  const db = getClient();
  const result = await db.execute({
    sql: 'SELECT * FROM comprovantes WHERE id = :id',
    args: { id },
  });
  return result.rows[0] || null;
}

export async function deletarComprovante(id) {
  const db = getClient();
  await db.execute({
    sql: 'DELETE FROM comprovantes WHERE id = :id',
    args: { id },
  });
}

// ─────────────────────────────────────────
// USUÁRIOS
// ─────────────────────────────────────────

export async function buscarUsuarioPorEmail(email) {
  const db = getClient();
  const result = await db.execute({
    sql: 'SELECT * FROM usuarios WHERE email = :email LIMIT 1',
    args: { email },
  });
  return result.rows[0] || null;
}

export async function listarUsuarios() {
  const db = getClient();
  const result = await db.execute(
    'SELECT id, nome, email, criado_em FROM usuarios ORDER BY criado_em ASC'
    // ↑ NÃO retorna senha_hash por segurança
  );
  return result.rows;
}

export async function inserirUsuario(dados) {
  const db = getClient();
  const result = await db.execute({
    sql: `INSERT INTO usuarios (nome, email, senha_hash)
          VALUES (:nome, :email, :senha_hash)`,
    args: {
      nome:       dados.nome,
      email:      dados.email,
      senha_hash: dados.senha_hash,
    },
  });
  return result.lastInsertRowid;
}

export async function deletarUsuario(id) {
  const db = getClient();
  await db.execute({
    sql: 'DELETE FROM usuarios WHERE id = :id',
    args: { id },
  });
}

export async function atualizarSenhaUsuario(id, novaSenhaHash) {
  const db = getClient();
  await db.execute({
    sql: 'UPDATE usuarios SET senha_hash = :hash WHERE id = :id',
    args: { hash: novaSenhaHash, id },
  });
}
