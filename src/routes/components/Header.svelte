<script>
    import { onMount } from 'svelte';
    import { fade, slide, fly } from 'svelte/transition';
    import { elasticOut, cubicOut } from 'svelte/easing';
    import { 
        Home, 
        Code2, 
        Clock, 
        Moon,
        Sun,
        Menu,
        X,
        GithubIcon 
    } from 'lucide-svelte';
    
    let isOpen = false;
    let prevScrollPos = 0;
    let isHeaderVisible = true;
    let isScrolled = false;
    let isDarkMode = true; // Default to dark mode
    
    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '#', label: 'Coming Soon', icon: Code2, badge: 'Soon' },
        { href: '#', label: 'Updates', icon: Clock, badge: 'New' }
    ];
    
    function toggleMenu() {
        isOpen = !isOpen;
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }
    
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        // Add theme toggle logic here
    }
    
    function handleScroll() {
        const currentScrollPos = window.pageYOffset;
        isHeaderVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50;
        isScrolled = currentScrollPos > 20;
        prevScrollPos = currentScrollPos;
    }
    
    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<header 
    class="fixed top-0 w-full z-50 transition-all duration-300 {isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}"
>
    <!-- Animated gradient line -->
    <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    
    <!-- Backdrop -->
    <div class="absolute inset-0 backdrop-blur-md bg-gray-900/70 shadow-lg shadow-black/10"></div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-4 relative">
        <div class="flex items-center justify-between">
            <!-- Logo -->
            <a 
                href="/" 
                class="relative group flex items-center space-x-3"
            >
                <div class="relative w-10 h-10">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-75 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                    <div class="relative w-full h-full bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700/50">
                        <Code2 size={20} class="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="text-2xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" 
                          style="font-family: 'Dancing Script', cursive;">
                        CodeDrop
                    </span>
                    <span class="text-xs text-gray-400">Under Development</span>
                </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center space-x-6">
                {#each navItems as item}
                    <a 
                        href={item.href}
                        class="group relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300"
                    >
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div class="relative flex items-center space-x-2">
                            <svelte:component this={item.icon} size={18} />
                            <span>{item.label}</span>
                            {#if item.badge}
                                <span class="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/20">
                                    {item.badge}
                                </span>
                            {/if}
                        </div>
                    </a>
                {/each}

                <!-- GitHub Link -->
                <a 
                    href="https://github.com/onkar69483/CodeDrop"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                    <GithubIcon size={20} />
                </a>

                <!-- Theme Toggle -->
                <button 
                    on:click={toggleTheme}
                    class="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                    {#if isDarkMode}
                        <Moon size={20} />
                    {:else}
                        <Sun size={20} />
                    {/if}
                </button>
            </nav>

            <!-- Mobile Menu Button -->
            <button 
                class="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white focus:outline-none"
                on:click={toggleMenu}
            >
                {#if isOpen}
                    <X size={24} />
                {:else}
                    <Menu size={24} />
                {/if}
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if isOpen}
        <div 
            class="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-50"
            transition:fade={{ duration: 200 }}
            on:click={toggleMenu}
        >
            <div 
                class="h-full w-full max-w-sm ml-auto bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-md p-6"
                transition:slide={{ duration: 300, axis: 'x', easing: cubicOut }}
                on:click|stopPropagation
            >
                <div class="flex flex-col h-full">
                    <div class="flex justify-between items-center mb-8">
                        <span class="text-xl font-semibold text-white">Navigation</span>
                        <button 
                            class="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                            on:click={toggleMenu}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    <nav class="flex flex-col space-y-4">
                        {#each navItems as item}
                            <a 
                                href={item.href}
                                class="group flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/30 border border-gray-700/30 hover:border-blue-500/30 text-gray-300 hover:text-white transition-all duration-300"
                            >
                                <div class="flex items-center space-x-3">
                                    <svelte:component this={item.icon} size={20} />
                                    <span>{item.label}</span>
                                </div>
                                {#if item.badge}
                                    <span class="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/20">
                                        {item.badge}
                                    </span>
                                {/if}
                            </a>
                        {/each}
                    </nav>

                    <div class="mt-auto space-y-4">
                        <!-- GitHub Link -->
                        <a 
                            href="https://github.com/onkar69483/CodeDrop"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center space-x-3 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/30 border border-gray-700/30 hover:border-blue-500/30 text-gray-300 hover:text-white transition-all duration-300"
                        >
                            <GithubIcon size={20} />
                            <span>View on GitHub</span>
                        </a>

                        <!-- Development Notice -->
                        <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <p class="text-sm text-gray-300">
                                🚧 CodeDrop is currently under development. New features coming soon!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</header>

<style>
    /* Custom scrollbar styles */
    :global(body) {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }
    
    :global(body::-webkit-scrollbar) {
        width: 6px;
    }
    
    :global(body::-webkit-scrollbar-track) {
        background: transparent;
    }
    
    :global(body::-webkit-scrollbar-thumb) {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }

    /* Animation keyframes */
    @keyframes glow {
        0%, 100% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
    }
</style>