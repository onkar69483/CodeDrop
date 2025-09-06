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
  import toast, { Toaster } from "svelte-french-toast";
  import { fade, slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { enhance } from "$app/forms";
  import { goto } from '$app/navigation';

  let view = 'choose'; // 'choose', 'public', 'room'
  let roomCode = '';
  let error = '';
  let loading = false;

  // Function to create a new room
  async function createRoom() {
    loading = true;
    try {
        const response = await fetch('/rooms', {
            method: 'POST'
        });
        const data = await response.json();
        if (response.ok) {
            goto(`/rooms/${data.room.code}`);
        } else {
            error = data.error;
            toast.error(data.error);
        }
    } catch (err) {
        error = 'Failed to create room';
        toast.error('Failed to create room');
    } finally {
        loading = false;
    }
  }

  // Function to join a room
  async function joinRoom() {
    if (!roomCode) {
        toast.error('Please enter a room code');
        return;
    }
    if (roomCode.length !== 6) {
        toast.error('Invalid room code format');
        return;
    }
    goto(`/rooms/${roomCode}`);
  }

  let selectedLanguage = "markup";
  let isDragging = false;
  let showSuccessToast = false;
  let toastMessage = "";
  let toastType = "success";
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
  
  function showToast(message: string, type: 'success' | 'error' = 'success') {
      toastMessage = message;
      toast[type](message);
      toastType = type;
      showSuccessToast = true;
      setTimeout(() => {
          showSuccessToast = false;
          toastMessage = '';
      }, 3000);
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
      showToast("File uploaded successfully!");
    };
    reader.readAsText(file);
  }

  function handleFileSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      handleFile(input.files[0]);
    }
  }

  function clearFields() {
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const textArea = document.getElementById("text") as HTMLTextAreaElement;
    const fileInput = document.getElementById("file") as HTMLInputElement;
    const pasteExpirationSelect = document.getElementById(
      "paste_expiration"
    ) as HTMLSelectElement;

    titleInput.value = "";
    textArea.value = "";
    fileInput.value = "";
    pasteExpirationSelect.value = "1 minute";
    currentTab = "editor";
    createdPasteUrl = "";
    showToast("All fields cleared");
  }

  function clearFieldsAfterSubmit() {
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const textArea = document.getElementById("text") as HTMLTextAreaElement;
    const fileInput = document.getElementById("file") as HTMLInputElement;
    const pasteExpirationSelect = document.getElementById(
      "paste_expiration"
    ) as HTMLSelectElement;

    titleInput.value = "";
    textArea.value = "";
    fileInput.value = "";
    pasteExpirationSelect.value = "1 minute";
    currentTab = "editor";
    createdPasteUrl = "";
  }

  function handleFormSubmit() {
    return async ({ result, update }) => {
      if (result.type === 'success' && result.data?.encryptedId) {
        createdPasteUrl = `${window.location.origin}/${result.data.encryptedId}`;
        showToast("Paste created successfully! Link copied to clipboard.");
        try {
          await navigator.clipboard.writeText(createdPasteUrl);
        } catch (err) {
          console.error("Failed to copy link:", err);
        }
        
        // Small delay to ensure proper sequence
        setTimeout(() => {
          // Clear the form without showing "All fields cleared" toast
          clearFieldsAfterSubmit();
        }, 100);
        
        // Update the page data to show the new paste
        await update();
        
      } else if (result.type === 'failure') {
        showToast("Failed to create paste. Please try again.", "error");
      }
    };
  }

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

  function handleLanguageChange(event) {
    selectedLanguage = event.target.value;
    if (currentTab === "preview") highlightSyntax();
  }

  async function sharePaste(paste) {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + `/${paste.id}`
      );
      showToast("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy link", "error");
    }
  }

  async function shareLink(pasteId: string) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this paste!",
          text: "I found this interesting paste:",
          url: `${window.location.origin}/${pasteId}`,
        });
        showToast("Link shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        showToast("Failed to share link", "error");
      }
    } else {
      showToast("Web Share API is not supported in your browser", "error");
    }
  }

  async function copyPasteContent(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Content copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy content", "error");
    }
  }
</script>

{#if view === 'choose'}
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <div class="container mx-auto px-4 py-16 max-w-4xl">
      <h1 class="text-4xl font-bold text-center mb-4">Welcome to CodeDrop</h1>
      <p class="text-center text-gray-400 mb-12">Choose how you want to share your code</p>
      
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Create Room Card -->
        <div 
          class="bg-gray-800 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-700 cursor-pointer"
          on:click={createRoom}
        >
          <div class="text-center mb-4">
            <span class="text-4xl">🔒</span>
          </div>
          <h2 class="text-xl font-semibold text-center mb-2">Create Private Room</h2>
          <p class="text-gray-400 text-center text-sm">
            Get a private room with a unique code for secure collaboration
          </p>
          {#if loading}
            <div class="mt-4 text-center text-blue-400">Creating room...</div>
          {/if}
        </div>

        <!-- Join Room Card -->
        <div class="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <div class="text-center mb-4">
            <span class="text-4xl">🤝</span>
          </div>
          <h2 class="text-xl font-semibold text-center mb-2">Join Room</h2>
          <p class="text-gray-400 text-center text-sm mb-4">
            Enter a room code to collaborate
          </p>
          <div class="flex flex-col items-center">
            <input
              type="text"
              bind:value={roomCode}
              maxlength="6"
              placeholder="Enter room code"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-center mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <button
              on:click={joinRoom}
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
            >
              Join Room
            </button>
          </div>
        </div>

        <!-- Public Paste Card -->
        <div 
          class="bg-gray-800 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-700 cursor-pointer"
          on:click={() => view = 'public'}
        >
          <div class="text-center mb-4">
            <span class="text-4xl">🌐</span>
          </div>
          <h2 class="text-xl font-semibold text-center mb-2">Public Paste</h2>
          <p class="text-gray-400 text-center text-sm">
            Create or view public pastes accessible to everyone
          </p>
        </div>
      </div>

      {#if error}
        <div class="mt-6 text-red-500 text-center">{error}</div>
      {/if}
    </div>
  </div>
{:else if view === 'public'}
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white" transition:fade>
    <Toaster />

    <div class="container mx-auto px-4 py-8">
      <button
        on:click={() => view = 'choose'}
        class="mb-6 text-blue-400 hover:text-blue-300 flex items-center"
      >
        ← Back to options
      </button>

      <div class="max-w-5xl mx-auto">
        <!-- Create Paste Section -->
        <div
          class="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700"
        >
          <h2 class="text-3xl font-bold mb-6 flex items-center">
            <span class="mr-3">📋</span> Create a New Paste
          </h2>

          <form method="POST" action="?/createPaste" class="space-y-6" use:enhance={handleFormSubmit}>
            <!-- Title Input -->
            <div>
              <label for="title" class="block text-lg font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter a descriptive title..."
              />
            </div>

            <!-- Language Selector -->
            <div>
              <label class="block text-lg font-medium mb-2"> Language </label>
              <select
                bind:value={selectedLanguage}
                on:change={handleLanguageChange}
                class="w-full md:w-1/3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              >
                {#each languageOptions as option}
                  <option value={option.value}>
                    {option.icon}
                    {option.label}
                  </option>
                {/each}
              </select>
            </div>

            <!-- File Drop Zone -->
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
                <div
                  class="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg border-2 border-blue-500 pointer-events-none"
                ></div>
              {/if}
            </div>

            <!-- Editor Tabs -->
            <div class="border border-gray-700 rounded-lg overflow-hidden">
              <div class="flex bg-gray-900 px-4 py-2 gap-4">
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg transition-colors {currentTab ===
                  'editor'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'}"
                  on:click={() => (currentTab = "editor")}
                >
                  ✏️ Editor
                </button>
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg transition-colors {currentTab ===
                  'preview'
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
                  class="w-full bg-gray-900 p-4 focus:outline-none font-mono {currentTab ===
                  'editor'
                    ? 'block'
                    : 'hidden'}"
                  placeholder="Enter or paste your code here..."
                ></textarea>
                <div
                  id="code-preview"
                  class="w-full bg-gray-900 p-4 max-h-[500px] overflow-auto {currentTab ===
                  'preview'
                    ? 'block'
                    : 'hidden'}"
                ></div>
              </div>
            </div>

            <!-- Expiration Selector -->
            <div>
              <label for="paste_expiration" class="block text-lg font-medium mb-2">
                Expiration Time
              </label>
              <select
                id="paste_expiration"
                name="paste_expiration"
                class="w-full md:w-1/3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              >
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
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
              >
                💾 Save Paste
              </button>
              <button
                type="button"
                on:click={clearFields}
                class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
              >
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
                <div
                  class="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all"
                  transition:slide={{ duration: 300, easing: quintOut }}
                >
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
                    <a
                      href={`/${paste.encryptedUrl}`}
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
                    <button
                      on:click={() => shareLink(paste.encryptedUrl)}
                      class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      📤 Share
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
  </div>
{/if}