<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale, blur } from 'svelte/transition';
  import { elasticOut, cubicOut, backOut } from 'svelte/easing';
  import { spring } from 'svelte/motion';
  import { 
    Rocket, 
    Shield, 
    Zap, 
    Palette, 
    Layout, 
    Loader, 
    Bell,
    Github,
    Twitter,
    Mail
  } from 'lucide-svelte';

  let mounted = false;
  let progress = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Parallax effect with enhanced sensitivity
  function handleMouseMove(event: MouseEvent) {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 30;
  }

  onMount(() => {
    mounted = true;
    
    // Progress animation
    const interval = setInterval(() => {
      progress = (progress + 1) % 100;
    }, 50);

    // Particle system
    initializeParticles();
    
    return () => clearInterval(interval);
  });

  function initializeParticles() {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Particle[] = [];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.5 + 0.2})`,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25
      });
    }
    
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx + mouseX * 0.005;
        particle.y += particle.vy + mouseY * 0.005;
        
        // Boundary checking
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  interface Particle {
    x: number;
    y: number;
    radius: number;
    color: string;
    vx: number;
    vy: number;
  }

  const features = [
    { icon: Rocket, title: "Lightning Fast", description: "Optimized for maximum performance" },
    { icon: Shield, title: "Enhanced Security", description: "State-of-the-art protection" },
    { icon: Zap, title: "Real-time Updates", description: "Instant synchronization" },
    { icon: Palette, title: "Modern Design", description: "Beautiful user interface" },
    { icon: Layout, title: "Responsive UI", description: "Perfect on all devices" },
    { icon: Loader, title: "Auto-scaling", description: "Handles any workload" }
  ];
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} />

<div class="relative min-h-screen bg-gray-900 text-white overflow-hidden font-space-grotesk">
  <!-- Animated background -->
  <div class="absolute inset-0 overflow-hidden">
    <!-- Base gradient background -->
    <div class="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-indigo-900/10"></div>
    
    <!-- Interactive gradient overlay -->
    <div 
      class="absolute inset-0 opacity-40 transition-all duration-700 ease-in-out"
      style="background: radial-gradient(circle at {50 + mouseX/2}% {50 + mouseY/2}%, rgba(56, 189, 248, 0.4) 0%, rgba(59, 130, 246, 0.35) 20%, rgba(147, 51, 234, 0.3) 40%, rgba(79, 70, 229, 0.25) 60%, transparent 100%)"
    ></div>
    
    <!-- Particle canvas -->
    <canvas id="particle-canvas" class="absolute inset-0 opacity-70"></canvas>
    
    <!-- Animated mesh pattern -->
    <div class="absolute inset-0 bg-[url('/mesh-pattern.svg')] bg-repeat opacity-5"></div>
    
    <!-- Glow effects -->
    <div 
      class="absolute w-[800px] h-[800px] rounded-full bg-blue-500/20 blur-[120px] animate-glow-slow"
      style="left: {30 + mouseX/3}%; top: {20 + mouseY/3}%"
    ></div>
    <div 
      class="absolute w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[100px] animate-glow-medium"
      style="right: {25 + mouseX/4}%; bottom: {30 + mouseY/4}%"
    ></div>
  </div>

  <!-- Main content -->
  <div class="relative z-10 container mx-auto px-4 py-24 lg:py-32">
    <div class="min-h-screen flex flex-col items-center justify-center">
      {#if mounted}
        <!-- Hero section -->
        <div 
          in:fly={{ y: -50, duration: 1200, delay: 200, easing: elasticOut }} 
          class="text-center mb-16"
        >
          <div class="inline-block p-5 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md mb-8 animate-float shadow-lg shadow-blue-500/10">
            <Rocket size={48} class="text-blue-400"/>
          </div>
          
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight animate-gradient">
            Something Amazing<br/>Is Coming Soon
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We're crafting a revolutionary new experience that will change 
            the way you interact with our platform.
          </p>
        </div>

        <!-- Progress indicator -->
        <div 
          in:scale={{ duration: 1000, delay: 400 }}
          class="w-full max-w-md mx-auto mb-20"
        >
          <div class="relative h-3 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse-subtle"
              style="width: {progress}%; transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);"
            ></div>
          </div>
          <div class="mt-4 text-center text-gray-400 font-medium tracking-wide">
            <span class="font-semibold text-blue-400">{progress}%</span> Complete
          </div>
        </div>

        <!-- Features grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto">
          {#each features as feature, i}
            <div
              in:fly={{ y: 50, duration: 1000, delay: 600 + (i * 100), easing: backOut }}
              class="group p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div class="mb-5 p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 w-fit group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                <svelte:component this={feature.icon} size={28} class="text-blue-400 group-hover:text-blue-300 transition-colors"/>
              </div>
              <h3 class="text-xl font-semibold mb-3 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
              <p class="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
            </div>
          {/each}
        </div>

        <!-- Newsletter -->
        <div 
          in:fly={{ y: 50, duration: 1000, delay: 1200, easing: cubicOut }}
          class="w-full max-w-xl mx-auto"
        >
          <div class="p-8 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 shadow-lg shadow-blue-900/5 hover:shadow-blue-500/10">
            <div class="flex items-center justify-center mb-6">
              <div class="p-2 rounded-lg bg-blue-500/10 mr-3 animate-pulse-slow">
                <Bell size={28} class="text-blue-400"/>
              </div>
              <h3 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Stay Updated</h3>
            </div>
            
            <form class="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-5 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/80 transition-all duration-300 placeholder-gray-500"
              />
              <button
                type="submit"
                class="px-6 py-3.5 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
              >
                Notify Me
              </button>
            </form>
            
            <p class="text-xs text-gray-500 mt-4 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        <!-- Social links -->
        <div 
          in:fly={{ y: 50, duration: 1000, delay: 1400 }}
          class="flex gap-6 mt-12"
        >
        {#each [Github, Twitter, Mail] as Icon, i}
        <a 
          href={i === 0 ? "https://github.com/onkar69483/CodeDrop" : i === 1 ? "/" : "mailto:onkar69483@gmail.com"} 
          class="p-3 rounded-full bg-gray-800/50 hover:bg-blue-500/20 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
          in:fly={{ y: 20, x: (i-1)*10, duration: 600, delay: 1600 + (i * 100), easing: elasticOut }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={20} class="text-gray-400 hover:text-blue-300 transition-colors"/>
        </a>
      {/each}      
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Curved bottom border -->
  <div class="absolute bottom-0 left-0 right-0 overflow-hidden">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="absolute bottom-0 w-full h-20 text-gray-800">
      <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity=".25"></path>
      <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="currentColor" opacity=".5"></path>
      <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
    </svg>
  </div>
</div>

<style>
  @keyframes sparkle {
    0%, 100% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1) rotate(180deg);
      opacity: 0.3;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-10px) scale(1.05);
    }
  }
  
  @keyframes glow-slow {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(1.2);
    }
  }
  
  @keyframes glow-medium {
    0%, 100% {
      opacity: 0.15;
      transform: scale(1);
    }
    50% {
      opacity: 0.25;
      transform: scale(1.15);
    }
  }
  
  @keyframes pulse-subtle {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  :global(body) {
    overflow-x: hidden;
    background: #111827;
  }
  
  .font-space-grotesk {
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  
  .animate-glow-slow {
    animation: glow-slow 8s ease-in-out infinite;
  }
  
  .animate-glow-medium {
    animation: glow-medium 6s ease-in-out infinite;
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 3s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 5s ease infinite;
  }
</style>