// Browser-compatible utility functions (no crypto operations)

export function encryptData(data) {
  // This function is not used in the browser
  throw new Error('encryptData is server-side only');
}

export function decryptData(data) {
  // This function is not used in the browser
  throw new Error('decryptData is server-side only');
}

export function encryptObjectId(objectId) {
  // This function is not used in the browser
  throw new Error('encryptObjectId is server-side only');
}

export function decryptObjectId(encryptedId) {
  // This function is not used in the browser
  throw new Error('decryptObjectId is server-side only');
}

export function encryptUrlId(uuid) {
  // This function is not used in the browser
  throw new Error('encryptUrlId is server-side only');
}

export function generateUrlId() {
  // This function is not used in the browser
  throw new Error('generateUrlId is server-side only');
}

export function uniqueId(){
  // Browser-compatible UUID generation
  return crypto.randomUUID();
}