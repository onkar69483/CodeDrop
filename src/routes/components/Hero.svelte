<script>
  import { Terminal, Rocket, Users, Lock, ArrowRight, Sparkles } from 'lucide-svelte';

</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Animated Background Elements -->
  <div class="absolute inset-0">
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
  </div>
  
  <!-- Code Pattern Background -->
  <div class="absolute inset-0 opacity-5">
    <div class="absolute top-20 left-20 font-mono text-xs text-white transform rotate-12">
      function shareCode() {'{'}
      <br/>
      &nbsp;&nbsp;return "instant";
      <br/>
      {'}'}
    </div>
    <div class="absolute bottom-32 right-32 font-mono text-xs text-white transform -rotate-12">
      const magic = true;
      <br/>
      if (magic) share();
    </div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 text-center">
    <!-- Hero Content -->
    <div class="mb-16">
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-700/50">
          <Sparkles class="w-5 h-5 text-yellow-400" />
          <span class="text-slate-300 text-sm font-medium">The Developer's Choice</span>
        </div>
      </div>
      
      <h1 class="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
        Code Sharing
        <span class="block bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Reimagined
        </span>
      </h1>
      
      <p class="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
        Experience the future of code collaboration. Share snippets instantly, collaborate seamlessly, 
        and showcase your work with enterprise-grade security and beautiful presentation.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
        <a 
          href="#create-pastes" 
          class="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
        >
          <Terminal class="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span class="text-lg">Create Your First Paste</span>
          <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
        
        <div class="flex items-center space-x-4 text-slate-400">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm">Live in seconds</span>
          </div>
          <div class="w-1 h-4 bg-slate-600"></div>
          <span class="text-sm">No signup required</span>
        </div>
      </div>
    </div>

    <!-- Enhanced Feature Grid -->
    <div class="grid md:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 group hover:transform hover:scale-105">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Terminal class="w-8 h-8 text-blue-400" />
        </div>
        <h3 class="text-xl font-bold text-white mb-3">Smart Highlighting</h3>
        <p class="text-slate-400 leading-relaxed">Advanced syntax highlighting with support for 50+ programming languages and frameworks</p>
      </div>
      
      <div class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 group hover:transform hover:scale-105">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Rocket class="w-8 h-8 text-purple-400" />
        </div>
        <h3 class="text-xl font-bold text-white mb-3">Blazing Fast</h3>
        <p class="text-slate-400 leading-relaxed">Optimized performance with instant loading and real-time collaboration features</p>
      </div>
      
      <div class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 group hover:transform hover:scale-105">
        <div class="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Users class="w-8 h-8 text-cyan-400" />
        </div>
        <h3 class="text-xl font-bold text-white mb-3">Team Ready</h3>
        <p class="text-slate-400 leading-relaxed">Built for teams with sharing controls, expiration settings, and collaboration tools</p>
      </div>
      
      <div class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 group hover:transform hover:scale-105">
        <div class="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Lock class="w-8 h-8 text-emerald-400" />
        </div>
        <h3 class="text-xl font-bold text-white mb-3">Enterprise Security</h3>
        <p class="text-slate-400 leading-relaxed">End-to-end encryption, auto-expiration, and content moderation for maximum security</p>
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