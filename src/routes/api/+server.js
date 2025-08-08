import { error } from "@sveltejs/kit";
import {
  getPaste,
} from "$lib/dataStore";
import { decryptObjectId } from "$lib/serverEncryptUtil";

export async function GET({ url }) {
 
  const encryptedId = url.searchParams.get("id");
  
  // Decrypt the ObjectId
  const objectId = decryptObjectId(encryptedId);
  
  if (!objectId) {
    throw error(404, "Invalid paste ID");
  }

  const paste = await getPaste(objectId);
  if (!paste) {
    throw error(404, "Paste not found or expired");
  }

  return new Response(
    JSON.stringify({
      id: paste,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}