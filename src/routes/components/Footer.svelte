<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut, backOut } from 'svelte/easing';
  import { 
      GithubIcon,
      Code2,
      Heart,
      Coffee,
      Mail,
      BookOpen,
      FileText,
      ExternalLink,
      Twitter,
      Linkedin,
  } from 'lucide-svelte';
  
  let isVisible = false;
  let currentYear = new Date().getFullYear();
  let isHovered = {};
  
  const socialLinks = [
      { href: 'https://github.com/onkar69483/CodeDrop', label: 'GitHub', icon: GithubIcon },
      { href: '#', label: 'Twitter', icon: Twitter },
      { href: '#', label: 'LinkedIn', icon: Linkedin },
      { href: 'mailto:contact@codedrop.dev', label: 'Email', icon: Mail }
  ];
  
  const footerLinks = [
      { href: 'https://github.com/onkar69483/CodeDrop/blob/main/README.md', label: 'Documentation', icon: BookOpen },
      { href: 'https://github.com/onkar69483/CodeDrop/blob/main/LICENSE', label: 'License', icon: FileText },
      { href: '#', label: 'Roadmap', icon: ExternalLink, isNew: true },
      { href: '#', label: 'Support', icon: Coffee }
  ];
  
  onMount(() => {
      const observer = new IntersectionObserver(
          (entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      isVisible = true;
                  }
              });
          }, 
          { threshold: 0.1 }
      );
      
      const footer = document.querySelector('footer');
      if (footer) observer.observe(footer);
      
      return () => {
          if (footer) observer.unobserve(footer);
      };
  });
</script>

<footer class="relative bg-gray-900 text-white overflow-hidden">
  <!-- Animated gradient border at the top -->
  <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse"></div>
  
  <!-- Background glow effect -->
  <div class="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-purple-900/5"></div>
  
  <!-- Star-like particles -->
  {#if isVisible}
      {#each Array(15) as _, i}
          <div 
              in:fade={{ delay: 300 + i * 100, duration: 1000 }}
              class="absolute w-1 h-1 rounded-full bg-blue-300/30"
              style="top: {Math.random() * 100}%; left: {Math.random() * 100}%; animation: twinkle {1.5 + Math.random() * 2}s ease-in-out infinite;"
          ></div>
      {/each}
  {/if}
  
  <div class="container mx-auto px-6 py-12 relative">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          <!-- Logo and Description -->
          {#if isVisible}
              <div 
                  class="col-span-1 md:col-span-1 space-y-4"
                  in:fly={{ y: 20, duration: 800, delay: 150, easing: backOut }}
              >
                  <a href="/" class="flex items-center space-x-2 group">
                      <div class="relative w-10 h-10">
                          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-75 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                          <div class="relative w-full h-full bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700/50">
                              <Code2 size={20} class="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                          </div>
                      </div>
                      <span class="text-2xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" 
                            style="font-family: 'Dancing Script', cursive;">
                          CodeDrop
                      </span>
                  </a>
                  <p class="text-gray-400 text-sm">
                      A beautiful, modern application currently under development. Join our journey as we build something amazing.
                  </p>
                  <div class="flex items-center space-x-1 text-sm text-gray-400">
                      <span>Made with</span>
                      <Heart size={16} class="text-red-400 animate-pulse" />
                      <span>by developers for developers</span>
                  </div>
              </div>
          {/if}

          <!-- Links -->
          {#if isVisible}
              <div 
                  class="col-span-1 md:col-span-1 space-y-4"
                  in:fly={{ y: 20, duration: 800, delay: 300, easing: backOut }}
              >
                  <h3 class="text-lg font-semibold text-white mb-4">Quick Links</h3>
                  <ul class="space-y-3">
                      {#each footerLinks as link, i}
                          <li>
                              <a 
                                  href={link.href} 
                                  class="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
                                  on:mouseenter={() => isHovered[link.label] = true}
                                  on:mouseleave={() => isHovered[link.label] = false}
                              >
                                  <div class="relative">
                                      <svelte:component this={link.icon} size={16} />
                                      {#if isHovered[link.label]}
                                          <div 
                                              class="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"
                                              in:scale={{ duration: 200, start: 0.5 }}
                                          ></div>
                                      {/if}
                                  </div>
                                  <span>{link.label}</span>
                                  {#if link.isNew}
                                      <span class="px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/20">
                                          New
                                      </span>
                                  {/if}
                              </a>
                          </li>
                      {/each}
                  </ul>
              </div>
          {/if}

          <!-- Connect -->
          {#if isVisible}
              <div 
                  class="col-span-1 md:col-span-1 space-y-4"
                  in:fly={{ y: 20, duration: 800, delay: 450, easing: backOut }}
              >
                  <h3 class="text-lg font-semibold text-white mb-4">Connect</h3>
                  <div class="flex space-x-3">
                      {#each socialLinks as social, i}
                          <a 
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 relative group"
                              title={social.label}
                          >
                              <svelte:component this={social.icon} size={18} />
                              <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  {social.label}
                              </span>
                          </a>
                      {/each}
                  </div>
                  <p class="text-sm text-gray-400 mt-6">
                      Stay connected with us for the latest updates and announcements.
                  </p>
              </div>
          {/if}

          <!-- Newsletter -->
          {#if isVisible}
              <div 
                  class="col-span-1 md:col-span-1 space-y-4"
                  in:fly={{ y: 20, duration: 800, delay: 600, easing: backOut }}
              >
                  <h3 class="text-lg font-semibold text-white mb-4">Stay Updated</h3>
                  <p class="text-sm text-gray-400 mb-4">
                      Subscribe to our newsletter for early access and dev insights.
                  </p>
                  <form class="space-y-2">
                      <div class="relative">
                          <input 
                              type="email" 
                              placeholder="Your email address" 
                              class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 focus:border-blue-500/50 rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                          />
                      </div>
                      <button 
                          type="submit" 
                          class="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                      >
                          Subscribe
                      </button>
                  </form>
              </div>
          {/if}
      </div>
      
      <!-- Divider -->
      {#if isVisible}
          <div 
              class="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"
              in:scale={{ duration: 1000, delay: 700, easing: elasticOut }}
          ></div>
      {/if}
      
      <!-- Bottom section -->
      {#if isVisible}
          <div 
              class="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 space-y-4 md:space-y-0"
              in:fade={{ duration: 800, delay: 900 }}
          >
              <span>
                  © {currentYear} CodeDrop. 
                  <a href="https://github.com/onkar69483/CodeDrop/blob/main/LICENSE" class="hover:text-indigo-400 transition-colors duration-200">
                      Open source
                  </a>
              </span>
              
              <a 
                  href="https://github.com/onkar69483/CodeDrop"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 hover:from-blue-500/10 hover:to-purple-500/10 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300"
              >
                  <GithubIcon size={16} />
                  <span>Star on GitHub</span>
                  <div class="relative">
                      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div class="animate-ping absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-400 opacity-75"></div>
                      </div>
                      <div class="h-1 w-1 rounded-full bg-blue-500"></div>
                  </div>
              </a>
          </div>
      {/if}
  </div>
</footer>

<style>
  @keyframes twinkle {
      0%, 100% {
          opacity: 0.1;
      }
      50% {
          opacity: 0.8;
      }
  }

  @keyframes floatUp {
      0% {
          transform: translateY(10px);
          opacity: 0;
      }
      100% {
          transform: translateY(0);
          opacity: 1;
      }
  }

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