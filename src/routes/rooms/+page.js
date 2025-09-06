import { goto } from '$app/navigation';

let roomCode = '';
let error = '';

async function createRoom() {
    try {
        const response = await fetch('/rooms', {
            method: 'POST'
        });
        const data = await response.json();
        if (response.ok) {
            goto(`/rooms/${data.room.code}`);
        } else {
            error = data.error;
        }
    } catch (err) {
        error = 'Failed to create room';
    }
}

async function joinRoom() {
    if (!roomCode) {
        error = 'Please enter a room code';
        return;
    }
    goto(`/rooms/${roomCode}`);
}
