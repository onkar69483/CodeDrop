import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
    const response = await fetch(`/rooms?code=${params.code}`);
    const data = await response.json();

    if (!response.ok) {
        throw error(404, 'Room not found');
    }

    return {
        room: data.room
    };
}
