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
  import Hero from "./components/Hero.svelte";
  import { fade, slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { enhance } from "$app/forms";

  let selectedLanguage = "markup";
  let isDragging = false;
  let showSuccessToast = false;
  let toastMessage = "";
  let toastType = "success"; // 'success' or 'error'
  let currentTab = "editor"; // 'editor' or 'preview'
  let createdPasteUrl = "";
  let showModerationPopup = false;
  let moderationMessage = "";

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
    if (secondsRemaining < 86400)
      return `${Math.floor(secondsRemaining / 3600)}h`;
    return `${Math.floor(secondsRemaining / 86400)}d`;
  }

  function showToast(message: string, type: 'success' | 'error' = 'success') {
      toastMessage = message;
      toastType = type;
      showSuccessToast = true;
      setTimeout(() => {
          showSuccessToast = false;
          toastMessage = '';
      }, 3000);
  }

  function showContentModerationPopup(message: string) {
    moderationMessage = message;
    showModerationPopup = true;
  }

  function closeModerationPopup() {
    showModerationPopup = false;
    moderationMessage = "";
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
    const titleInput = document.getElementById("title");
    const textArea = document.getElementById("text");
    const languageSelect = document.getElementById("language");
    const expirationSelect = document.getElementById("paste_expiration");

    if (titleInput) titleInput.value = "";
    if (textArea) textArea.value = "";
    if (languageSelect) languageSelect.selectedIndex = 0;
    if (expirationSelect) expirationSelect.selectedIndex = 0;

    selectedLanguage = "text";
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
      // Check if the data contains a failure response (SvelteKit wraps failures in success)
      if (result.data?.type === 'failure') {
        if (result.data.data?.inappropriate) {
          showContentModerationPopup(result.data.data.message);
        } else if (result.data.data?.moderationError) {
          showToast(result.data.data.message, "error");
        } else {
          showToast("Failed to create paste. Please try again.", "error");
        }
        return;
      }
      
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
        if (result.data?.inappropriate) {
          showContentModerationPopup(result.data.message);
        } else if (result.data?.moderationError) {
          showToast(result.data.message, "error");
        } else {
          showToast("Failed to create paste. Please try again.", "error");
        }
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

<Hero />

{#if showSuccessToast}
    <div transition:slide={{ duration: 300, axis: 'x' }} 
         class="fixed top-1/2 -translate-y-1/2 right-4 px-6 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-2 {toastType === 'success' ? 'bg-green-500/90 backdrop-blur-sm' : 'bg-red-500/90 backdrop-blur-sm'} text-white">
        <span class="text-xl">
            {#if toastType === 'success'}
                ✓
            {:else}
                ✕
            {/if}
        </span>
        <p class="font-medium">{toastMessage}</p>
    </div>
{/if}

<!-- Content Moderation Popup -->
{#if showModerationPopup}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" transition:fade={{ duration: 200 }}>
        <div class="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-lg w-full border border-red-500/50" transition:slide={{ duration: 300 }}>
            <div class="flex items-center gap-4 mb-6">
                <div class="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span class="text-2xl">🚫</span>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-red-400">Content Blocked</h3>
                    <p class="text-gray-400 text-sm">Your paste contains inappropriate content</p>
                </div>
            </div>
            
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p class="text-red-300 font-medium mb-2">Reason:</p>
                <p class="text-gray-300 leading-relaxed">
                    {moderationMessage.replace('Content contains inappropriate language: ', '')}
                </p>
            </div>
            
            <div class="bg-gray-700/50 rounded-lg p-4 mb-6">
                <p class="text-gray-300 text-sm leading-relaxed">
                    <span class="font-medium text-blue-400">💡 What to do:</span><br>
                    Please review your title and content, remove any inappropriate language, and try submitting again.
                </p>
            </div>
            
            <div class="flex justify-end gap-3">
                <button 
                    on:click={closeModerationPopup}
                    class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium transform hover:scale-105"
                >
                    ✓ Got it, I'll fix it
                </button>
            </div>
        </div>
    </div>
{/if}

<div
  id="create-pastes" class="min-h-screen bg-gradient-to-b from-gray-900/80 to-gray-800/80 text-white px-4 py-8 md:px-6"
>
  <div class="max-w-5xl mx-auto">
    <!-- Create Paste Section -->
    <div
      class="bg-gray-800/40 rounded-2xl shadow-2xl p-8 mb-12 border border-gray-700/50 backdrop-blur-md"
    >
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-white flex items-center">
          <span class="mr-3 text-4xl">✨</span> Create a New Paste
        </h2>
        <div class="px-3 py-1.5 bg-gray-700/50 text-gray-300 text-sm rounded-lg border border-gray-600/50">
          🚀 Quick Share
        </div>
      </div>

      <form method="POST" action="?/createPaste" enctype="multipart/form-data" class="space-y-6" use:enhance={handleFormSubmit}>
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
            class="input-primary w-full glow"
            placeholder="Enter a descriptive title..."
          />
        </div>

        <!-- Language Selector -->
        <div>
          <label for="language" class="block text-lg font-medium mb-2"> Language </label>
          <select
            id="language"
            bind:value={selectedLanguage}
            on:change={handleLanguageChange}
            class="select-primary w-full md:w-1/3 glow"
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
            class="block p-8 border-2 border-dashed border-gray-600/50 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 text-center glass glow group"
          >
            <div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📂</div>
            <div class="space-y-2">
              <span class="text-xl font-medium text-white">Drop files here or click to upload</span>
              <p class="text-sm text-gray-400">Supports: .txt, .css, .html, .js, .ts, .py, .java</p>
            </div>
          </label>
          {#if isDragging}
            <div
              class="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg border-2 border-blue-500 pointer-events-none"
            ></div>
          {/if}
        </div>

        <!-- Editor Tabs -->
        <div class="glass border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-xl">
          <div class="flex bg-gray-900/80 px-6 py-3 gap-2">
            <button
              type="button"
              class="px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 {currentTab ===
              'editor'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}"
              on:click={() => (currentTab = "editor")}
            >
              ✏️ Editor
            </button>
            <button
              type="button"
              class="px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 {currentTab ===
              'preview'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}"
              on:click={highlightSyntax}
            >
              👁️ Preview
            </button>
          </div>

          <div class="relative">
            <textarea
              id="text"
              name="text"
              rows="12"
              required
              class="textarea-primary w-full {currentTab ===
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
            class="select-primary w-full md:w-1/3 glow"
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
        <div class="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="submit"
            class="btn-primary flex items-center justify-center space-x-2 glow"
          >
            <span class="text-xl">💾</span>
            <span>Save Paste</span>
          </button>
          <button
            type="button"
            on:click={clearFields}
            class="btn-danger flex items-center justify-center space-x-2"
          >
            <span class="text-xl">🗑️</span>
            <span>Clear All</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Recent Pastes Section -->
    <div id="recent-pastes" class="bg-gray-800/40 rounded-2xl shadow-2xl p-8 border border-gray-700/50 backdrop-blur-md">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-white flex items-center">
          <span class="mr-3 text-4xl">📚</span> Recent Pastes
        </h2>
        <div class="px-3 py-1.5 bg-gray-700/50 text-gray-300 text-sm rounded-lg border border-gray-600/50">
          🕒 Latest Activity
        </div>
      </div>

      {#if data.pastes && data.pastes.length > 0}
        <div class="grid gap-4">
          {#each data.pastes as paste}
            <div
              class="bg-gray-700/30 hover:bg-gray-700/40 rounded-xl p-6 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group backdrop-blur-sm"
              transition:slide={{ duration: 300, easing: quintOut }}
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-white group-hover:text-gray-200 transition-colors">{paste.title || 'Untitled Paste'}</h3>
                <div class="flex items-center space-x-2">
                  {#if paste.paste_expiration}
                    <span class="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30">
                      ⏳ {formatExpirationTime(paste.paste_expiration)}
                    </span>
                  {:else}
                    <span class="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                      ♾️ Never expires
                    </span>
                  {/if}
                </div>
              </div>
              <p class="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                {paste.text ? paste.text.substring(0, 150) + '...' : 'No content available'}
              </p>
              <div class="flex justify-between items-center pt-4 border-t border-gray-700/50">
                <div class="flex items-center space-x-2 text-sm text-gray-400">
                  <span>🕒</span>
                  <span>Created {paste.createdAt ? new Date(paste.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <a
                    href="/{paste.encryptedUrl}"
                    class="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-white text-sm rounded-lg transition-all"
                  >
                    👁️ View
                  </a>
                  <button
                    on:click={() => navigator.clipboard.writeText(paste.text)}
                    class="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-white text-sm rounded-lg transition-all"
                  >
                    📋 Copy
                  </button>
                  <button
                    on:click={() => navigator.share ? navigator.share({title: paste.title, url: `${window.location.origin}/${paste.encryptedUrl}`}) : navigator.clipboard.writeText(`${window.location.origin}/${paste.encryptedUrl}`)}
                    class="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-white text-sm rounded-lg transition-all"
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-12 text-gray-400">
          <div class="text-6xl mb-6 animate-bounce">📭</div>
          <h3 class="text-xl font-medium mb-2">No pastes yet</h3>
          <p class="text-gray-500">Create your first paste above to get started!</p>
        </div>
      {/if}
    </div>
  </div>
</div>
