import { getStore } from '@netlify/blobs';

const STORE_NAME = 'nota-unica';
const KEY = 'nota';

const buildResponse = (statusCode, body) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  return new Response(body ? JSON.stringify(body) : null, {
    status: statusCode,
    headers
  });
};

export default async (request, context) => {
  if (request.method === 'OPTIONS') {
    return buildResponse(204);
  }

  const store = getStore(STORE_NAME, { context });

  try {
    if (request.method === 'GET') {
      const text = await store.get(KEY, { type: 'text' });
      if (text === null) {
        return buildResponse(404, { message: 'Nota no encontrada' });
      }
      return buildResponse(200, { content: text });
    }

    if (request.method === 'POST') {
      const payload = await request.json().catch(() => null);
      if (!payload || typeof payload.content !== 'string' || !payload.content.trim()) {
        return buildResponse(400, { message: 'Contenido inválido' });
      }
      const content = payload.content.trim();
      await store.set(KEY, content, { metadata: { updatedAt: new Date().toISOString() } });
      return buildResponse(200, { message: 'Nota guardada', content });
    }

    if (request.method === 'DELETE') {
      await store.delete(KEY);
      return buildResponse(204);
    }

    return buildResponse(405, { message: 'Método no permitido' });
  } catch (error) {
    console.error('Error en función note:', error);
    return buildResponse(500, { message: 'Error interno del servidor' });
  }
};
