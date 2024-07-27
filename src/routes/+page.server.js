
import { error } from "@sveltejs/kit";
import { uniqueId, hash } from "$lib/encryptUtil";
import { insertPaste, initializeDatabase, getAllPastes } from "$lib/dataStore";

await initializeDatabase();


export const actions = {
  createPaste: async ({ request }) => {
    const formData = await request.formData();
    let text = formData.get("text");
    const title = formData.get("title");
    const paste_expiration = formData.get("paste_expiration");

    try {
      const expirationTimestamp = paste_expiration === 'never' ? null : Date.now() + parseExpirationTime(paste_expiration);
      const dataToBeInserted = {
        id: uniqueId(),
        text,
        title,
        paste_expiration: expirationTimestamp,
      };

      await insertPaste(dataToBeInserted);
      return { success: true };
    } catch (err) {
      console.error("Error creating paste:", err);
      throw error(500, "An error occurred while creating the paste. Please try again later.");
    }
  },
};

export async function load() {
  const pastes = await getAllPastes();
  return { pastes };
}

function parseExpirationTime(expirationString) {
  if (expirationString === "never") {
    return null;
  }
  
  const [value, unit] = expirationString.split(" ");
  const numericValue = parseInt(value, 10);

  switch (unit) {
    case "minutes":
    case "minute":
      return numericValue * 60 * 1000;
    case "hours":
    case "hour":
      return numericValue * 3600 * 1000;
    case "days":
    case "day":
      return numericValue * 86400 * 1000;
    case "weeks":
    case "week":
      return numericValue * 604800 * 1000;
    case "months":
    case "month":
      return numericValue * 2592000 * 1000;
    case "years":
    case "year":
      return numericValue * 31536000 * 1000;
    default:
      throw new Error("Invalid expiration time format");
  }
}
