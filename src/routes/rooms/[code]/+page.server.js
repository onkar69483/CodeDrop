import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function load({ params }) {
    try {
        const room = await prisma.room.findUnique({
            where: { code: params.code },
            include: {
                pastes: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!room) {
            throw error(404, 'Room not found');
        }

        return {
            room
        };
    } catch (err) {
        throw error(500, 'Failed to load room');
    }
}

export const actions = {
    getData: async ({ params }) => {
        try {
            const room = await prisma.room.findUnique({
                where: { code: params.code },
                include: {
                    pastes: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            if (!room) {
                return {
                    type: 'failure',
                    error: 'Room not found'
                };
            }

            return {
                type: 'success',
                room
            };
        } catch (err) {
            return {
                type: 'failure',
                error: 'Failed to load room'
            };
        }
    },

    createPaste: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title');
        const text = data.get('text');
        const roomCode = data.get('roomCode');

        try {
            const room = await prisma.room.findUnique({
                where: { code: roomCode }
            });

            if (!room) {
                return {
                    type: 'failure',
                    error: 'Room not found'
                };
            }

            const paste = await prisma.paste.create({
                data: {
                    title,
                    text,
                    roomId: room.id
                }
            });

            return {
                type: 'success',
                data: { id: paste.id }
            };
        } catch (err) {
            return {
                type: 'failure',
                error: 'Failed to create paste'
            };
        }
    }
};
