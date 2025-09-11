<script>
    import { onMount } from 'svelte';
    
    let currentYear = new Date().getFullYear();
    let mounted = false;
    
    const socialLinks = [
        {
            name: 'GitHub',
            url: 'https://github.com/onkar69483/CodeDrop',
            icon: '🔗',
            color: 'hover:text-gray-300'
        },
        {
            name: 'Documentation',
            url: 'https://github.com/onkar69483/CodeDrop/blob/main/README.md',
            icon: '📚',
            color: 'hover:text-blue-400'
        },
        {
            name: 'License',
            url: 'https://github.com/onkar69483/CodeDrop/blob/main/LICENSE',
            icon: '⚖️',
            color: 'hover:text-green-400'
        }
    ];
    
    onMount(() => {
        mounted = true;
    });
</script>

<footer class="relative bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700/50">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Subtle gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-cyan-900/10 opacity-50"></div>
        
        <!-- Floating particles -->
        {#if mounted}
            {#each Array(8) as _, i}
                <div
                    class="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                    style="
                        left: {10 + (i * 12)}%;
                        top: {20 + Math.random() * 60}%;
                        animation: float {4 + Math.random() * 3}s infinite ease-in-out;
                        animation-delay: {i * 0.5}s;
                    "
                ></div>
            {/each}
        {/if}
    </div>
    
    <div class="relative z-10 container mx-auto px-4 py-12">
        <!-- Main footer content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <!-- Brand section -->
            <div class="space-y-4">
                <div class="flex items-center space-x-2">
                    <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" 
                          style="font-family: 'Dancing Script', cursive;">
                        CodeDrop
                    </span>
                    <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        Beta
                    </span>
                </div>
                <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
                    Share code snippets securely with automatic expiration. Perfect for quick collaborations and ephemeral exchanges.
                </p>
            </div>
            
            <!-- Quick links -->
            <div class="space-y-4">
                <h3 class="text-lg font-semibold text-white mb-3 relative">
                    Quick Links
                    <div class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                </h3>
                <ul class="space-y-2">
                    {#each socialLinks as link}
                        <li>
                            <a 
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="group flex items-center space-x-2 text-gray-400 {link.color} transition-all duration-200 hover:translate-x-1"
                            >
                                <span class="text-sm">{link.icon}</span>
                                <span class="text-sm">{link.name}</span>
                                <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">↗</span>
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
            
            <!-- Stats or features -->
            <div class="space-y-4">
                <h3 class="text-lg font-semibold text-white mb-3 relative">
                    Features
                    <div class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                </h3>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li class="flex items-center space-x-2">
                        <span class="text-green-400">✓</span>
                        <span>Automatic expiration</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <span class="text-green-400">✓</span>
                        <span>Syntax highlighting</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <span class="text-green-400">✓</span>
                        <span>Content moderation</span>
                    </li>
                    <li class="flex items-center space-x-2">
                        <span class="text-green-400">✓</span>
                        <span>Secure sharing</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- Bottom bar -->
        <div class="pt-8 border-t border-gray-700/50">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div class="flex items-center space-x-4 text-sm text-gray-400">
                    <span> {currentYear} CodeDrop. <a href="https://github.com/onkar69483/CodeDrop/blob/main/LICENSE" class="hover:text-indigo-400 transition-colors duration-200">Open source</a></span>
                </div>
                
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Made with</span>
                    <span class="text-red-400 animate-pulse">❤️</span>
                    <span>by the CodeDrop team</span>
                </div>
            </div>
        </div>
    </div>
</footer>

<style>
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.6;
        }
    }
</style>