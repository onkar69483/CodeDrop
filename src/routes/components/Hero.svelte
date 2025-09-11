<script>
  import { Terminal, Rocket, Users, Lock, ArrowRight, Sparkles } from 'lucide-svelte';

</script>

<section class="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900 group">
  <!-- Animated Background Elements -->
  <div class="absolute inset-0">
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse group-hover:scale-110 transition-transform duration-1000"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000 group-hover:scale-125 transition-transform duration-1000"></div>
  </div>

  <!-- ULTIMATE Background Effects System -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden">
    
    <!-- Enhanced Grid System -->
    <div class="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity duration-1000">
      <div class="absolute inset-0 animate-pulse" style="background-image: linear-gradient(rgba(59, 130, 246, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.25) 1px, transparent 1px); background-size: 40px 40px; animation-duration: 3s;"></div>
      <div class="absolute inset-0 animate-pulse" style="background-image: linear-gradient(rgba(168, 85, 247, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.18) 1px, transparent 1px); background-size: 80px 80px; animation-duration: 4s; animation-delay: 1s;"></div>
    </div>
    
    <!-- Advanced Particle System -->
    <div class="absolute top-5 left-5 w-1 h-1 bg-blue-400/40 rounded-full animate-ping group-hover:animate-bounce" style="animation-duration: 2s;"></div>
    <div class="absolute top-12 left-20 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse group-hover:animate-spin" style="animation-duration: 3s;"></div>
    <div class="absolute top-24 left-8 w-1.5 h-1.5 bg-cyan-400/35 rounded-full animate-bounce group-hover:animate-ping" style="animation-duration: 2.5s;"></div>
    
    <div class="absolute top-8 right-8 w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse group-hover:animate-bounce" style="animation-duration: 2.2s;"></div>
    <div class="absolute top-20 right-24 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce group-hover:animate-ping" style="animation-duration: 1.8s;"></div>
    <div class="absolute top-32 right-12 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-ping group-hover:animate-spin" style="animation-duration: 2.8s;"></div>
    
    <div class="absolute bottom-8 left-12 w-2 h-2 bg-cyan-400/25 rounded-full animate-pulse group-hover:animate-bounce" style="animation-duration: 2.3s;"></div>
    <div class="absolute bottom-20 left-32 w-1 h-1 bg-emerald-400/40 rounded-full animate-bounce group-hover:animate-ping" style="animation-duration: 1.9s;"></div>
    <div class="absolute bottom-32 left-8 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-ping group-hover:animate-spin" style="animation-duration: 2.6s;"></div>
    
    <div class="absolute bottom-12 right-16 w-2 h-2 bg-purple-400/25 rounded-full animate-pulse group-hover:animate-bounce" style="animation-duration: 2.1s;"></div>
    <div class="absolute bottom-28 right-8 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce group-hover:animate-ping" style="animation-duration: 2.4s;"></div>
    <div class="absolute bottom-40 right-28 w-1.5 h-1.5 bg-emerald-400/35 rounded-full animate-ping group-hover:animate-spin" style="animation-duration: 2.7s;"></div>
    
    <!-- Enhanced Neural Network Lines -->
    <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent group-hover:via-blue-400/50 transition-all duration-1500 animate-pulse" style="animation-duration: 3s;"></div>
    <div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/25 to-transparent group-hover:via-purple-400/45 transition-all duration-2000 animate-pulse" style="animation-duration: 4s;"></div>
    <div class="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent group-hover:via-cyan-400/40 transition-all duration-1800 animate-pulse" style="animation-duration: 3.5s;"></div>
    
    <!-- Enhanced Vertical Energy Streams -->
    <div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/25 to-transparent group-hover:via-blue-400/45 transition-all duration-2000 animate-pulse" style="animation-duration: 5s;"></div>
    <div class="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent group-hover:via-purple-400/40 transition-all duration-2500 animate-pulse" style="animation-duration: 4.2s;"></div>
    
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
    <!-- Left Content -->
    <div class="text-center lg:text-left">
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
        Code Sharing
        <span class="block bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent pb-2">
          Reimagined
        </span>
      </h1>
      
      <p class="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
        Share code snippets instantly with beautiful syntax highlighting, automatic expiration, and enterprise-grade security.
      </p>

      <!-- CTA Button -->
      <a 
        href="#create-pastes" 
        class="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
      >
        <Terminal class="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Create Your First Paste</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>

    <!-- Right Content - Code Example -->
    <div class="relative">
      <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <!-- Code Header -->
        <div class="bg-slate-900/80 px-6 py-4 border-b border-slate-700/50">
          <div class="flex items-center space-x-4">
            <div class="flex space-x-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-slate-400 text-sm font-mono">example.js</span>
          </div>
        </div>
        
        <!-- Code Content -->
        <div class="p-6 bg-slate-900">
          <pre class="text-sm font-mono text-slate-300 leading-relaxed"><code><span class="text-purple-400">function</span> <span class="text-blue-400">shareCode</span>(<span class="text-orange-400">snippet</span>) {'{'}
  <span class="text-gray-500">// Upload to CodeDrop</span>
  <span class="text-purple-400">const</span> <span class="text-blue-400">response</span> = <span class="text-purple-400">await</span> <span class="text-green-400">fetch</span>(<span class="text-yellow-400">'/api/paste'</span>, {'{'}
    <span class="text-blue-400">method</span>: <span class="text-yellow-400">'POST'</span>,
    <span class="text-blue-400">body</span>: <span class="text-orange-400">snippet</span>
  {'}'});
  
  <span class="text-purple-400">return</span> <span class="text-orange-400">response</span>.<span class="text-blue-400">url</span>; <span class="text-gray-500">// ✨ Instant share!</span>
{'}'}</code></pre>
        </div>
      </div>
      
      <!-- Floating badge -->
      <div class="absolute -top-4 -right-4 bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-lg shadow-lg">
        <Sparkles class="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
</section>

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