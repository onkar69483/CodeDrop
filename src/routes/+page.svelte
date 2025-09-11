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
  id="create-pastes" class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4 py-8 md:px-6"
>
  <div class="max-w-5xl mx-auto">
    <!-- Create Paste Section -->
    <div
      class="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700"
    >
      <h2 class="text-3xl font-bold mb-6 flex items-center">
        <span class="mr-3">📋</span> Create a New Paste
      </h2>

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
