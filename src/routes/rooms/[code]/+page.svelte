<script lang="ts">
    export let data;
    $: room = data.room;
    
    import Prism from "prismjs";
    import "prismjs/themes/prism-tomorrow.css";
    import "prismjs/components/prism-javascript";
    import "prismjs/components/prism-css";
    import "prismjs/components/prism-markup";
    import "prismjs/components/prism-typescript";
    import "prismjs/components/prism-python";
    import "prismjs/components/prism-java";
    import toast, { Toaster } from "svelte-french-toast";
    import { fade } from "svelte/transition";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { invalidateAll } from "$app/navigation";

    let selectedLanguage = "markup";
    let isDragging = false;
    let currentTab = "editor";
    let createdPasteUrl = "";

    const languageOptions = [
        { value: "plaintext", label: "Plain Text", icon: "📝" },
        { value: "css", label: "CSS", icon: "🎨" },
        { value: "markup", label: "HTML", icon: "🌐" },
        { value: "javascript", label: "JavaScript", icon: "⚡" },
        { value: "typescript", label: "TypeScript", icon: "📘" },
        { value: "python", label: "Python", icon: "🐍" },
        { value: "java", label: "Java", icon: "☕" },
    ];

    function highlightSyntax() {
        currentTab = "preview";
        const textArea = document.getElementById("text") as HTMLTextAreaElement;
        const codeBlock = document.getElementById("code-preview") as HTMLElement;

        if (textArea.value.trim()) {
            codeBlock.innerHTML = `<pre class="language-${selectedLanguage}"><code>${Prism.highlight(
                textArea.value,
                Prism.languages[selectedLanguage],
                selectedLanguage
            )}</code></pre>`;
        }
    }

    function handleDragEnter(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        const files = e.dataTransfer?.files;
        if (files && files[0]) handleFile(files[0]);
    }

    function handleFile(file: File) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const textArea = document.getElementById("text") as HTMLTextAreaElement;
            textArea.value = e.target?.result?.toString() || "";
            highlightSyntax();
            toast.success("File uploaded successfully!");
        };
        reader.readAsText(file);
    }

    function handleFileSelection(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            handleFile(input.files[0]);
        }
    }

    function handleLanguageChange(event) {
        selectedLanguage = event.target.value;
        if (currentTab === "preview") highlightSyntax();
    }

    async function copyRoomCode() {
        try {
            await navigator.clipboard.writeText(room.code);
            toast.success("Room code copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy room code");
        }
    }

    async function copyPasteContent(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Content copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy content");
        }
    }

    function handleFormSubmit() {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                toast.success("Paste created successfully!");
                // Clear form fields
                const titleInput = document.getElementById("title") as HTMLInputElement;
                const textArea = document.getElementById("text") as HTMLTextAreaElement;
                const fileInput = document.getElementById("file") as HTMLInputElement;
                titleInput.value = "";
                textArea.value = "";
                fileInput.value = "";
                currentTab = "editor";
                
                // Update the form and invalidate the data
                await update();
                await invalidateAll();
            } else {
                toast.error("Failed to create paste. Please try again.");
            }
        };
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4 py-8">
    <Toaster />
    
    <div class="max-w-5xl mx-auto">
        <a
            href="/"
            class="inline-block text-blue-400 hover:text-blue-300 mb-6"
        >
            ← Back to home
        </a>

        <div class="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">Room: {room.code}</h1>
                <button
                    on:click={copyRoomCode}
                    class="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    📋 Copy Room Code
                </button>
            </div>
            <p class="text-gray-400">Share this code with others to collaborate in this private room</p>
        </div>

        <!-- Create Paste Section -->
        <div class="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <span class="mr-3">📋</span> Create a New Paste
            </h2>

            <form method="POST" action="?/createPaste" enctype="multipart/form-data" class="space-y-6" use:enhance={handleFormSubmit}>
                <input type="hidden" name="roomCode" value={room.code} />
                
                <div>
                    <label for="title" class="block text-lg font-medium mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter a descriptive title..."
                    />
                </div>

                <div>
                    <label class="block text-lg font-medium mb-2">Language</label>
                    <select
                        bind:value={selectedLanguage}
                        on:change={handleLanguageChange}
                        class="w-full md:w-1/3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        {#each languageOptions as option}
                            <option value={option.value}>
                                {option.icon} {option.label}
                            </option>
                        {/each}
                    </select>
                </div>

                <div
                    class="relative"
                    on:dragenter={handleDragEnter}
                    on:dragleave={handleDragLeave}
                    on:dragover|preventDefault
                    on:drop={handleDrop}
                >
                    <input
                        type="file"
                        id="file"
                        name="file"
                        on:change={handleFileSelection}
                        class="hidden"
                        accept=".txt,.css,.html,.js,.ts,.py,.java"
                    />
                    <label
                        for="file"
                        class="block p-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center"
                    >
                        <div class="text-4xl mb-2">📂</div>
                        <span class="text-lg">Drop files here or click to upload</span>
                    </label>
                    {#if isDragging}
                        <div class="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg border-2 border-blue-500 pointer-events-none"></div>
                    {/if}
                </div>

                <div class="border border-gray-700 rounded-lg overflow-hidden">
                    <div class="flex bg-gray-900 px-4 py-2 gap-4">
                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg transition-colors {currentTab === 'editor'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-400 hover:text-white'}"
                            on:click={() => (currentTab = "editor")}
                        >
                            ✏️ Editor
                        </button>
                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg transition-colors {currentTab === 'preview'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-400 hover:text-white'}"
                            on:click={highlightSyntax}
                        >
                            👁️ Preview
                        </button>
                    </div>

                    <div class="relative">
                        <textarea
                            id="text"
                            name="text"
                            rows="10"
                            required
                            class="w-full bg-gray-900 p-4 focus:outline-none font-mono text-white {currentTab === 'editor'
                                ? 'block'
                                : 'hidden'}"
                            placeholder="Enter or paste your code here..."
                        ></textarea>
                        <div
                            id="code-preview"
                            class="w-full bg-gray-900 p-4 max-h-[500px] overflow-auto {currentTab === 'preview'
                                ? 'block'
                                : 'hidden'}"
                        ></div>
                    </div>
                </div>

                <button
                    type="submit"
                    class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
                >
                    💾 Save Paste
                </button>
            </form>
        </div>

        <!-- Room Pastes Section -->
        <div class="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <span class="mr-3">📚</span> Room Pastes
            </h2>

            {#if room.pastes && room.pastes.length > 0}
                <div class="grid gap-4">
                    {#each room.pastes as paste}
                        <div
                            class="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all"
                            transition:fade
                        >
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-xl font-bold">{paste.title}</h3>
                                <span class="bg-gray-700 px-3 py-1 rounded-full text-sm">
                                    {new Date(paste.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <p class="mb-4 text-gray-300 line-clamp-3 font-mono text-sm">
                                {paste.text}
                            </p>

                            <div class="flex gap-3">
                                <a
                                    href="/{paste.id}"
                                    class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                >
                                    👁️ View
                                </a>
                                <button
                                    on:click={() => copyPasteContent(paste.text)}
                                    class="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                                >
                                    📋 Copy
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-8 text-gray-400">
                    <div class="text-4xl mb-4">📭</div>
                    <p>No pastes in this room yet. Create your first paste above!</p>
                </div>
            {/if}
        </div>
    </div>
</div>
