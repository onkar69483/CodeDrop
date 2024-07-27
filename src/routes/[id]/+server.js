import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ params }) {
  try {
    const id = parseInt(params.id, 10);
    const snippet = await prisma.snippet.findUnique({
      where: { id },
    });

    if (snippet) {
      return new Response(JSON.stringify(snippet), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response("Snippet not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
