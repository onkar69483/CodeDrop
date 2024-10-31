<!-- 
   +page.svelte: This file is responsible for displaying the main page of the Pastebin tool, including the form to create a new paste and a list of recent pastes.
   
   +page.server.js: This file contains the server-side logic for handling the creation of new pastes and loading all pastes.
     
   api/+server.js: This file manages API endpoints for creating and fetching pastes.
   
   [id]/+page.svelte: This file handles displaying a specific paste, including decryption if needed.

    [id]/+server.js: This file manages fetching a specific paste by its ID.

	snippets/+server.js: This file handles the creation of new code snippets
  -->
  <script lang="ts">
    export let data: { pastes: any[] };
    import Prism from "prismjs";
    import "prismjs/themes/prism-tomorrow.css";
    import "prismjs/components/prism-javascript";
    import "prismjs/components/prism-css";
    import "prismjs/components/prism-markup";
    import "prismjs/components/prism-typescript";
    import "prismjs/components/prism-python";
    import "prismjs/components/prism-java";
    import Hero from './components/Hero.svelte';
    import { fade, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let selectedLanguage = "markup";
    let isDragging = false;
    let showSuccessToast = false;
    let currentTab = 'editor'; // 'editor' or 'preview'
    
    const languageOptions = [
        { value: "plaintext", label: "Plain Text", icon: "📝" },
        { value: "css", label: "CSS", icon: "🎨" },
        { value: "markup", label: "HTML", icon: "🌐" },
        { value: "javascript", label: "JavaScript", icon: "⚡" },
        { value: "typescript", label: "TypeScript", icon: "📘" },
        { value: "python", label: "Python", icon: "🐍" },
        { value: "java", label: "Java", icon: "☕" }
    ];

    function formatExpirationTime(expirationTimestamp: number | null): string {
        if (expirationTimestamp === null) return "Never";
        
        const now = Date.now();
        const secondsRemaining = Math.floor((expirationTimestamp - now) / 1000);
        
        if (secondsRemaining <= 0) return "Expired";
        if (secondsRemaining < 60) return `${secondsRemaining}s`;
        if (secondsRemaining < 3600) return `${Math.floor(secondsRemaining / 60)}m`;
        if (secondsRemaining < 86400) return `${Math.floor(secondsRemaining / 3600)}h`;
        return `${Math.floor(secondsRemaining / 86400)}d`;
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
        reader.onload = function(e) {
            const textArea = document.getElementById("text") as HTMLTextAreaElement;
            textArea.value = e.target?.result?.toString() || '';
            highlightSyntax();
            showToast();
        };
        reader.readAsText(file);
    }

    function handleFileSelection(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            handleFile(input.files[0]);
        }
    }

    function showToast() {
        showSuccessToast = true;
        setTimeout(() => {
            showSuccessToast = false;
        }, 3000);
    }

    function clearFields() {
        const titleInput = document.getElementById("title") as HTMLInputElement;
        const textArea = document.getElementById("text") as HTMLTextAreaElement;
        const fileInput = document.getElementById("file") as HTMLInputElement;
        const pasteExpirationSelect = document.getElementById("paste_expiration") as HTMLSelectElement;
        
        titleInput.value = "";
        textArea.value = "";
        fileInput.value = "";
        pasteExpirationSelect.value = "1 minute";
        currentTab = 'editor';
    }

    function highlightSyntax() {
        currentTab = 'preview';
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

    function handleLanguageChange(event) {
        selectedLanguage = event.target.value;
        if (currentTab === 'preview') highlightSyntax();
    }

    async function sharePaste(paste) {
        try {
            await navigator.clipboard.writeText(window.location.origin + `/${paste.id}`);
            showToast();
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
</script>

<Hero />

{#if showSuccessToast}
    <div transition:fade="{{ duration: 300 }}" 
         class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        ✓ Action completed successfully!
    </div>
{/if}

<div id = "create-pastes" class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4 py-8 md:px-6">
    <div class="max-w-5xl mx-auto">
        <!-- Create Paste Section -->
        <div class="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <span class="mr-3">📋</span> Create a New Paste
            </h2>
            
            <form method="POST" action="?/createPaste" class="space-y-6">
                <!-- Title Input -->
                <div>
                    <label for="title" class="block text-lg font-medium mb-2">
                        Title
                    </label>
                    <input type="text" id="title" name="title" required
                           class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
                           placeholder="Enter a descriptive title..." />
                </div>

                <!-- Language Selector -->
                <div>
                    <label class="block text-lg font-medium mb-2">
                        Language
                    </label>
                    <select bind:value={selectedLanguage} 
                            on:change={handleLanguageChange}
                            class="w-full md:w-1/3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
                        {#each languageOptions as option}
                            <option value={option.value}>
                                {option.icon} {option.label}
                            </option>
                        {/each}
                    </select>
                </div>

                <!-- File Drop Zone -->
                <div class="relative"
                     on:dragenter={handleDragEnter}
                     on:dragleave={handleDragLeave}
                     on:dragover|preventDefault
                     on:drop={handleDrop}>
                    <input type="file" id="file" name="file" 
                           on:change={handleFileSelection}
                           class="hidden" 
                           accept=".txt,.css,.html,.js,.ts,.py,.java" />
                    <label for="file" 
                           class="block p-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center">
                        <div class="text-4xl mb-2">📂</div>
                        <span class="text-lg">Drop files here or click to upload</span>
                    </label>
                    {#if isDragging}
                        <div class="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg border-2 border-blue-500 pointer-events-none">
                        </div>
                    {/if}
                </div>

                <!-- Editor Tabs -->
                <div class="border border-gray-700 rounded-lg overflow-hidden">
                    <div class="flex bg-gray-900 px-4 py-2 gap-4">
                        <button type="button" 
                                class="px-4 py-2 rounded-lg transition-colors {currentTab === 'editor' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}"
                                on:click={() => currentTab = 'editor'}>
                            ✏️ Editor
                        </button>
                        <button type="button"
                                class="px-4 py-2 rounded-lg transition-colors {currentTab === 'preview' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}"
                                on:click={highlightSyntax}>
                            👁️ Preview
                        </button>
                    </div>

                    <div class="relative">
                        <textarea id="text" name="text" rows="10" required
                                  class="w-full bg-gray-900 p-4 focus:outline-none font-mono {currentTab === 'editor' ? 'block' : 'hidden'}"
                                  placeholder="Enter or paste your code here..."></textarea>
                        <div id="code-preview" 
                             class="w-full bg-gray-900 p-4 max-h-[500px] overflow-auto {currentTab === 'preview' ? 'block' : 'hidden'}">
                        </div>
                    </div>
                </div>

                <!-- Expiration Selector -->
                <div>
                    <label for="paste_expiration" class="block text-lg font-medium mb-2">
                        Expiration Time
                    </label>
                    <select id="paste_expiration" name="paste_expiration"
                            class="w-full md:w-1/3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
                        <option value="1 minute">⏱️ 1 Minute</option>
                        <option value="5 minutes">⏱️ 5 Minutes</option>
                        <option value="10 minutes">⏱️ 10 Minutes</option>
                        <option value="1 hour">⏱️ 1 Hour</option>
                        <option value="1 day">📅 1 Day</option>
                        <option value="1 week">📅 1 Week</option>
                        <option value="1 month">📅 1 Month</option>
                        <option value="2 months">📅 2 Months</option>
                        <option value="6 months">📅 6 Months</option>
                        <option value="12 months">📅 12 Months</option>
                    </select>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col md:flex-row gap-4">
                    <button type="submit"
                            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105">
                        💾 Save Paste
                    </button>
                    <button type="button" on:click={clearFields}
                            class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all transform hover:scale-105">
                        🗑️ Clear All
                    </button>
                </div>
            </form>
        </div>

        <!-- Recent Pastes Section -->
        <div id="recent-pastes" class="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <span class="mr-3">📚</span> Recent Pastes
            </h2>
            
            {#if data.pastes && data.pastes.length > 0}
                <div class="grid gap-4">
                    {#each data.pastes as paste}
                        <div class="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all"
                             transition:slide="{{ duration: 300, easing: quintOut }}">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-xl font-bold">{paste.title}</h3>
                                <span class="bg-gray-700 px-3 py-1 rounded-full text-sm">
                                    ⏳ {formatExpirationTime(paste.paste_expiration)}
                                </span>
                            </div>
                            
                            <p class="mb-4 text-gray-300 line-clamp-3 font-mono text-sm">
                                {paste.text}
                            </p>
                            
                            <div class="flex gap-3">
                                <a href={`/${paste.id}`}
                                   class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                                    👁️ View
                                </a>
                                <button on:click={() => sharePaste(paste)}
                                        class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                    📋 Copy Link
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-8 text-gray-400">
                    <div class="text-4xl mb-4">📭</div>
                    <p>No pastes found. Create your first paste above!</p>
                </div>
            {/if}
        </div>
    </div>
</div>