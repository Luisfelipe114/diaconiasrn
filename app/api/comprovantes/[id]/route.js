import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { atualizarStatusComprovante } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Faltam dados' }, { status: 400 });
    }

    if (!['pendente', 'valido', 'invalido'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    await atualizarStatusComprovante(Number(id), status);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
