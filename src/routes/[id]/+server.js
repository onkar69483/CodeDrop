import { PrismaClient } from "@prisma/client";
import { decryptObjectId } from "$lib/serverEncryptUtil";

const prisma = new PrismaClient();

export async function GET({ params }) {
  try {
    const encryptedId = params.id;
    
    // Decrypt the ObjectId
    const objectId = decryptObjectId(encryptedId);
    
    if (!objectId) {
      return new Response("Invalid paste ID", { status: 404 });
    }
    
    const snippet = await prisma.paste.findUnique({
      where: { id: objectId },
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