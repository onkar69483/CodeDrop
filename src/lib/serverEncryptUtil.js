import crypto from 'crypto';
const secretKey = "f464fdcbd76681b5b1e44ebfd2a5a4989ad4ab6db151bc10743e7147d34a3dff".slice(0,32);
const iv = "7dbfb688da37f2ed35ee7f5f194a8ff8".slice(0,16);

// Function to encrypt MongoDB ObjectId for URL display (SERVER ONLY)
export function encryptObjectId(objectId) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    Buffer.from(iv)
  );
  let encrypted = cipher.update(objectId, "utf8", "base64");
  encrypted += cipher.final("base64");
  // Make URL safe
  return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Function to decrypt encrypted ObjectId back to original (SERVER ONLY)
export function decryptObjectId(encryptedId) {
  try {
    // Restore base64 padding
    let padded = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4) {
      padded += '=';
    }
    
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(secretKey),
      Buffer.from(iv)
    );
    let decrypted = decipher.update(padded, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Error decrypting ObjectId:", error);
    return null;
  }
}

export function uniqueId(){
  const uuid = crypto.randomUUID();
  return uuid
}
