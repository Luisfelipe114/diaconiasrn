/**
 * app/api/comprovantes/route.js
 * 
 * POST /api/comprovantes
 * Recebe o formulário multipart (nome, nascimento, foto) do fiel,
 * faz upload da imagem para o Vercel Blob e salva os dados no banco.
 */
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { initDb, inserirComprovante, listarComprovantes } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// GET — lista todos os comprovantes (usado pelo painel admin)
export async function GET(request) {
  try {
    await initDb();
    const comprovantes = await listarComprovantes();
    return NextResponse.json({ comprovantes });
  } catch (error) {
    console.error('Erro ao listar comprovantes:', error);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}

// POST — recebe e salva um novo comprovante
export async function POST(request) {
  try {
    await initDb();

    const formData = await request.formData();
    const nome       = formData.get('nome')?.toString().trim();
    const nascimento = formData.get('nascimento')?.toString().trim() || null;
    const foto       = formData.get('foto'); // File ou null

    // Validação básica
    if (!nome) {
      return NextResponse.json(
        { erro: 'O campo nome é obrigatório.' },
        { status: 400 }
      );
    }

    let fotoUrl = null;

    // Faz upload da foto se existir
    if (foto && foto.size > 0) {
      if (foto.size > 10 * 1024 * 1024) {
        return NextResponse.json({ erro: 'A imagem não pode ultrapassar 10MB.' }, { status: 400 });
      }

      const nomeLimpo = foto.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const nomeArquivo = `comprovantes/${Date.now()}-${nomeLimpo}`;

      // Vercel Blob (Produção)
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(nomeArquivo, foto, { access: 'public' });
        fotoUrl = blob.url;
      } 
      // Salvar fisicamente no disco (Dev/Local)
      else {
        const bytes = await foto.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Pasta public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        
        const fileName = `${Date.now()}-${nomeLimpo}`;
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        
        fotoUrl = `/uploads/${fileName}`;
      }
    }

    const id = await inserirComprovante({ nome, nascimento, foto_url: fotoUrl });

    // O libsql retorna o ID como BigInt, que o JSON.stringify não aceita.
    // Precisamos converter para string.
    return NextResponse.json({ sucesso: true, id: id.toString() }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar comprovante:', error);
    return NextResponse.json({ erro: 'Erro interno ao salvar.' }, { status: 500 });
  }
}
