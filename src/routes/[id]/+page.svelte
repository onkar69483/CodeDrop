<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { HighlightAuto } from "svelte-highlight";
  import atomOneDark from "svelte-highlight/styles/atom-one-dark";
  import ClipboardJS from "clipboard";
  import toast, { Toaster } from "svelte-french-toast";
  import { jsPDF } from "jspdf";
  import { goto } from "$app/navigation";
  import { fade, slide, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { Clock } from 'lucide-svelte';
  import { onDestroy } from "svelte";

  let id = null;
  let paste = null;
  let code = null;
  let errorMessage = "";
  let showSuccessToast = false;
  let toastMessage = "";
  let isLoading = true;
  let currentTime = new Date();
  let timeUpdateInterval;
  const doc = new jsPDF();

  function showToast(message) {
    toastMessage = message;
    showSuccessToast = true;
    setTimeout(() => {
      showSuccessToast = false;
      toastMessage = '';
    }, 3000);
  }

  // Reactive function to format expiration time with live updates
  $: formatExpirationTime = (expirationDate) => {
    if (!expirationDate) return 'Never expires';
    
    const expiry = new Date(expirationDate);
    const timeDiff = expiry.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) return 'Expired';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  onMount(async () => {
    id = $page.params.id;
    console.log(`fetching /api?id=${id}`);

    // Start live time updates
    timeUpdateInterval = setInterval(() => {
      currentTime = new Date();
    }, 1000);

    try {
      const res = await fetch(`/api?id=${id}`);
      if (!res.ok) {
        throw new Error("Invalid or non-existent paste ID.");
      }
      const data = await res.json();
      paste = data.id;
      code = paste.text;
      new ClipboardJS(".btn-clip");
      isLoading = false;
    } catch (error) {
      console.log("Error fetching paste:", error);
      errorMessage =
        "Oops! The paste you are looking for could not be found. Please check the URL and try again. If the issue persists, the paste may have expired or been removed.";
      isLoading = false;
    }
  });

  // Cleanup interval on component destroy
  onDestroy(() => {
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
    }
  });


  async function shareLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this code snippet!",
          text: `${paste.title} - Shared via CodeDrop`,
          url: window.location.href,
        });
        showToast("Link shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        showToast("Failed to share link");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!");
      } catch (err) {
        showToast("Failed to copy link");
      }
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(paste.text);
      showToast("Code copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy code");
    }
  }

  function downloadPDF() {
    try {
      doc.text(paste.text, 10, 10);
      doc.save(`${paste.title}.pdf`);
      showToast("PDF downloaded successfully!");
    } catch (err) {
      showToast("Failed to download PDF");
    }
  }
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>

<!-- Custom Toast Notification -->
{#if showSuccessToast}
    <div transition:slide={{ duration: 300, axis: 'x' }} 
         class="fixed top-1/2 -translate-y-1/2 right-4 px-6 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white">
        <span class="text-xl">✓</span>
        <p class="font-medium">{toastMessage}</p>
    </div>
{/if}

{#if errorMessage}
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex justify-center items-center px-4 pt-24" transition:fade={{ duration: 400 }}>
    <div class="max-w-lg w-full mx-auto bg-gradient-to-br from-red-900/80 to-red-800/80 backdrop-blur-xl text-white rounded-2xl shadow-2xl p-8 border border-red-500/30" transition:scale={{ duration: 400, start: 0.9 }}>
      <div class="flex items-center space-x-4 mb-6">
        <div class="flex-shrink-0 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
          <span class="text-3xl">🚫</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-red-300">Paste Not Found</h2>
          <p class="text-red-200/80 text-sm">The requested paste could not be loaded</p>
        </div>
      </div>
      
      <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
        <p class="text-red-200 leading-relaxed">{errorMessage}</p>
      </div>
      
      <div class="flex justify-end gap-3">
        <button
          on:click={() => goto("/")}
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          🏠 Go Home
        </button>
      </div>
    </div>
  </div>
{:else if paste}
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 pt-24 pb-8 md:px-6" transition:fade={{ duration: 400 }}>
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8" transition:slide={{ duration: 400, delay: 100 }}>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <button
            on:click={() => goto("/")}
            class="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
          >
            <span class="text-xl group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>Back to Home</span>
          </button>
          
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
                📋 Code Snippet
              </span>
              {#if paste.paste_expiration}
                <span class="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full border border-orange-500/30 flex items-center space-x-1">
                  <Clock class="w-3 h-3" />
                  <span>{formatExpirationTime(paste.paste_expiration)}</span>
                </span>
              {/if}
            </div>
            
            <!-- Action Buttons moved to top -->
            <div class="flex flex-wrap gap-2">
              <button
                on:click={copyToClipboard}
                class="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white text-sm rounded-lg transition-all transform hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </button>
              
              <button
                on:click={downloadPDF}
                class="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white text-sm rounded-lg transition-all transform hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>PDF</span>
              </button>
              
              <button
                on:click={shareLink}
                class="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white text-sm rounded-lg transition-all transform hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        
        <h1 class="text-4xl font-bold mb-4 text-white">
          {paste.title}
        </h1>
        
        <div class="h-1 w-24 bg-gray-600 rounded-full"></div>
      </div>

      <!-- Code Display Section -->
      <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden" transition:scale={{ duration: 400, delay: 200, start: 0.95 }}>
        <!-- Code Header -->
        <div class="bg-gray-900/80 px-6 py-4 border-b border-gray-700/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex space-x-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span class="text-gray-400 text-sm font-mono">{paste.title}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                on:click={copyToClipboard}
                class="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white group"
                title="Copy to clipboard"
              >
                <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Code Content -->
        <div class="relative">
          <div class="p-6 bg-slate-900 overflow-x-auto max-w-full">
            <div class="overflow-x-auto">
              <HighlightAuto code={paste.text} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex justify-center items-center px-4">
    <div class="text-center" transition:fade={{ duration: 400 }}>
      <div class="relative mb-8">
        <!-- Animated loading rings -->
        <div class="w-24 h-24 mx-auto relative">
          <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div class="absolute inset-2 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
        </div>
        
        <!-- Floating particles around loader -->
        <div class="absolute inset-0 pointer-events-none">
          {#each Array(6) as _, i}
            <div
              class="absolute w-2 h-2 bg-blue-400/60 rounded-full"
              style="
                left: {50 + 30 * Math.cos(i * Math.PI / 3)}%;
                top: {50 + 30 * Math.sin(i * Math.PI / 3)}%;
                animation: sparkle {2 + Math.random()}s infinite ease-in-out;
                animation-delay: {i * 0.2}s;
              "
            ></div>
          {/each}
        </div>
      </div>
      
      <h2 class="text-2xl font-bold text-white mb-4">Loading Code Snippet</h2>
      <p class="text-gray-400 mb-8">Please wait while we fetch your paste...</p>
      
      <div class="flex justify-center space-x-2">
        {#each Array(3) as _, i}
          <div
            class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style="animation-delay: {i * 0.2}s;"
          ></div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes sparkle {
    0%, 100% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1) rotate(180deg);
      opacity: 0.8;
    }
  }
</style>
