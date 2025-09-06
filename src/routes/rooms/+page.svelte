{#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{error}</span>
    </div>
{/if}

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Code Drop Rooms
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Create a new room or join an existing one
            </p>
        </div>
        <div class="mt-8 space-y-6">
            <button
                on:click={createRoom}
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Create New Room
            </button>
            
            <div class="relative">
                <input
                    bind:value={roomCode}
                    type="text"
                    maxlength="6"
                    placeholder="Enter 6-digit room code"
                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <button
                    on:click={joinRoom}
                    class="mt-3 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Join Room
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    let roomCode = '';
    let error = '';

    async function createRoom() {
        try {
            const response = await fetch('/rooms', {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                window.location.href = `/rooms/${data.room.code}`;
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
        if (roomCode.length !== 6) {
            error = 'Room code must be 6 digits';
            return;
        }
        window.location.href = `/rooms/${roomCode}`;
    }
</script>
