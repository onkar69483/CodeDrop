import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
  const { code } = await request.json();

  const snippet = await prisma.snippet.create({
    data: {
      code
    }
  });

  return new Response(JSON.stringify({ id: snippet.id }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
