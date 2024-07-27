import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// No need for initializeDatabase function as Prisma with MongoDB doesn't require manual table creation

// Function to insert a new paste
export async function insertPaste(data) {
  const { text, title, password, paste_expiration, encrypted } = data;

  // Insert the new paste into MongoDB
  const newPaste = await prisma.paste.create({
    data: {
      text,
      title,
      password,
      paste_expiration,
      encrypted,
    },
  });

  return newPaste;
}

// Function to get a paste by its ID
export async function getPaste(id) {
  // Find the paste with the given ID
  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  return paste;
}

// Function to get all non-expired pastes
export async function getAllPastes() {
  const now = new Date().getTime();

  // Find all pastes where paste_expiration is greater than the current time
  const pastes = await prisma.paste.findMany({
    where: {
      paste_expiration: {
        gt: now,
      },
    },
  });

  return pastes;
}
