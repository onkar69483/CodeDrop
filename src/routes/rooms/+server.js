import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate a random 6-digit room code
function generateRoomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a new room
export async function POST() {
    try {
        let code;
        let existingRoom;

        // Keep generating codes until we find a unique one
        do {
            code = generateRoomCode();
            existingRoom = await prisma.room.findUnique({
                where: { code }
            });
        } while (existingRoom);

        const room = await prisma.room.create({
            data: { code }
        });

        return json({ room }, { status: 201 });
    } catch (error) {
        return json({ error: 'Failed to create room' }, { status: 500 });
    }
}

// Get room by code
export async function GET({ url }) {
    try {
        const code = url.searchParams.get('code');
        if (!code) {
            return json({ error: 'Room code is required' }, { status: 400 });
        }

        const room = await prisma.room.findUnique({
            where: { code },
            include: {
                pastes: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!room) {
            return json({ error: 'Room not found' }, { status: 404 });
        }

        return json({ room });
    } catch (error) {
        return json({ error: 'Failed to fetch room' }, { status: 500 });
    }
}
