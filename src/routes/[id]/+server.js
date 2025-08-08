import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET({ params }) {
  try {
    const id = params.id;
    
    // Skip if it's a favicon or other static file request
    if (id.includes('.') || !isValidObjectId(id)) {
      return new Response("Not found", { status: 404 });
    }
    
    const snippet = await prisma.paste.findUnique({
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