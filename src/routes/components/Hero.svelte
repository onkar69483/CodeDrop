<script>
  import { fade, scale } from 'svelte/transition';
  import { Code2, Lock, Clock, Share2, ChevronRight, Github } from 'lucide-svelte';

  const features = [
    { icon: Code2, text: "Share code snippets instantly" },
    { icon: Lock, text: "Secure, encrypted sharing" },
    { icon: Clock, text: "Set custom expiration times" },
  ];

  function scrollToCreate() {
        const element = document.getElementById('create-pastes');
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
  <div class="container mx-auto px-4 py-16 lg:py-24">
    <div class="flex flex-col lg:flex-row items-center gap-12">
      <!-- Left Content -->
      <div 
        in:fade={{ duration: 600, delay: 200 }}
        class="flex flex-col items-center lg:items-start lg:w-1/2"
      >
        <div class="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full mb-6">
          <span class="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span class="text-sm text-gray-300">Now in Public Beta</span>
        </div>

        <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center lg:text-left mb-6 leading-tight">
          Unleash your code with{' '}
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            CodeDrop
          </span>
        </h1>

        <p class="text-lg text-gray-300 text-center lg:text-left mb-8 max-w-xl">
          Share code snippets securely and efficiently. Set expiration times for automatic 
          deletion, ensuring your code stays private and controlled.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
          <button
              on:click={scrollToCreate}
              class="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white flex items-center justify-center transition-all duration-200"
          >
              Get Started 
              <ChevronRight class="ml-2 w-4 h-4" />
          </button>
          
          <button
            class="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 flex items-center justify-center transition-all duration-200"
          >
            <Github class="mr-2 w-4 h-4" />
            <a href="https://github.com/onkar69483/CodeDrop">View on GitHub</a>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {#each features as feature, i}
            <div
              in:fade={{ duration: 600, delay: i * 100 }}
              class="flex items-center gap-3 bg-gray-800/30 rounded-lg p-4"
            >
              <div class="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                <svelte:component this={feature.icon} size={20} />
              </div>
              <span class="text-sm text-gray-300">{feature.text}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right Content -->
      <div
        in:scale={{ duration: 600, delay: 200, start: 0.95 }}
        class="lg:w-1/2"
      >
        <div class="relative">
          <!-- Decorative elements -->
          <div class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-20 animate-pulse"></div>
          
          <!-- Main image container -->
          <div class="relative bg-gray-800 rounded-lg p-2">
            <div class="flex items-center gap-2 border-b border-gray-700 p-3">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <img
              class="rounded-b-lg w-full object-cover"
              alt="CodeDrop Interface"
              src="/Snap.png"
            />
          </div>

          <!-- Floating badges -->
          <div class="absolute -top-4 -right-4 bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-lg shadow-lg">
            <Share2 class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Add any additional custom styles here */
  :global(.animate-pulse) {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>