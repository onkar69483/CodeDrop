import crypto from 'crypto';
import bcrypt from "bcrypt";
const saltRounds = 1;
const secretKey = "f464fdcbd76681b5b1e44ebfd2a5a4989ad4ab6db151bc10743e7147d34a3dff".slice(0,32);
const iv = "7dbfb688da37f2ed35ee7f5f194a8ff8".slice(0,16);

export function encryptData(data) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    Buffer.from(iv)
  );
  let encryptedText = cipher.update(data, "utf8", "hex");
  encryptedText += cipher.final("hex");
  return encryptedText
}

export function decryptData(data) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    Buffer.from(iv)
  );
  let decryptedText = decipher.update(data, "hex", "utf8");
  decryptedText += decipher.final("utf8");
  return decryptedText
}


export async function hash(password){
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

export async function checkPassword(userPassword,hashedPassword){
  try {
    const isMatch = await bcrypt.compare(userPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    return false
  }
}

export function uniqueId(){
  const uuid = crypto.randomUUID();
  return uuid
}