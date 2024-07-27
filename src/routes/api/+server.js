import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import {
  getPaste,
  initializeDatabase,
  deleteExpiredPastes,
} from "$lib/dataStore";

initializeDatabase(); // Ensure this runs once at startup

const secretKey =
  "f464fdcbd76681b5b1e44ebfd2a5a4989ad4ab6db151bc10743e7147d34a3dff".slice(
    0,
    32
  );
const iv = "7dbfb688da37f2ed35ee7f5f194a8ff8".slice(0, 16);


export async function GET({ url }) {
 
  const uid = url.searchParams.get("id");

  const paste = await getPaste(uid);
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

function parseExpirationTime(expirationString) {
  const [value, unit] = expirationString.split(" ");
  const numericValue = parseInt(value, 10);

  switch (unit) {
    case "minutes":
    case "minute":
      return numericValue * 60 * 1000; // Convert to milliseconds
    case "hours":
    case "hour":
      return numericValue * 3600 * 1000; // Convert to milliseconds
    case "days":
    case "day":
      return numericValue * 86400 * 1000; // Convert to milliseconds
    default:
      throw new Error("Invalid expiration time format");
  }
}
