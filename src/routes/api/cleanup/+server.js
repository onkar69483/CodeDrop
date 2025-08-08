import { deleteExpiredPastes } from '$lib/dataStore';

export async function GET() {
  try {
    const result = await deleteExpiredPastes();
    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: result.count,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 