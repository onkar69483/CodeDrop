<script>
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    
    let isOpen = false;
    let prevScrollPos = 0;
    let isHeaderVisible = true;
    let isScrolled = false;
    
    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    function handleScroll() {
        const currentScrollPos = window.pageYOffset;
        isHeaderVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50;
        isScrolled = currentScrollPos > 20;
        prevScrollPos = currentScrollPos;
    }

    function handleNavClick(event) {
        const targetId = event.target.getAttribute('href').split('#')[1];
        const element = document.getElementById(targetId);
        
        if (element) {
            event.preventDefault();
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            if (isOpen) toggleMenu();
        }
    }
    
    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<header 
    class="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md {isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} {isScrolled ? 'bg-gray-900/95 shadow-xl' : 'bg-transparent'}"
>
    <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
            <!-- Logo -->
            <a 
                href="/" 
                class="relative group"
            >
                <span class="text-3xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" 
                      style="font-family: 'Dancing Script', cursive;">
                CodeDrop
                </span>
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center space-x-8">
                {#each [{href: '/#create-pastes', label: 'Create Paste', icon: '✨'}, 
                        {href: '/#recent-pastes', label: 'Recent Pastes', icon: '📋'}] as item}
                    <a 
                        href={item.href}
                        on:click={handleNavClick}
                        class="group relative px-2 py-1 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        <span class="flex items-center space-x-2">
                            <span class="text-sm">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                {/each}
                
                <!-- Theme Toggle Button (Optional) -->
                <button 
                    class="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 text-gray-300 hover:text-white"
                >
                    <span class="text-sm">🌙</span>
                </button>
            </nav>

            <!-- Mobile Menu Button -->
            <button 
                class="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white focus:outline-none"
                on:click={toggleMenu}
            >
                <div class="w-6 h-6 flex flex-col justify-center space-y-1.5 transition-all duration-300 {isOpen ? 'transform rotate-180' : ''}">
                    <span class="w-full h-0.5 bg-current transform transition-all duration-300 {isOpen ? 'rotate-45 translate-y-2' : ''}"></span>
                    <span class="w-full h-0.5 bg-current transition-all duration-300 {isOpen ? 'opacity-0' : 'opacity-100'}"></span>
                    <span class="w-full h-0.5 bg-current transform transition-all duration-300 {isOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
                </div>
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if isOpen}
        <div 
            class="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50"
            transition:fade={{ duration: 200 }}
            on:click={toggleMenu}
        >
            <div 
                class="h-full max-w-sm ml-auto bg-gray-800/95 backdrop-blur-sm p-6"
                transition:slide={{ duration: 300, axis: 'x', easing: cubicOut }}
                on:click|stopPropagation
            >
                <div class="flex flex-col h-full">
                    <div class="flex justify-between items-center mb-8">
                        <span class="text-xl font-semibold text-white">Navigation</span>
                        <button 
                            class="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                            on:click={toggleMenu}
                        >
                            <span class="text-2xl">×</span>
                        </button>
                    </div>
                    
                    <nav class="flex flex-col space-y-4">
                        {#each [{href: '/#create-pastes', label: 'Create Paste', icon: '✨'}, 
                                {href: '/#recent-pastes', label: 'Recent Pastes', icon: '📋'}] as item}
                            <a 
                                href={item.href}
                                on:click={handleNavClick}
                                class="group flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
                            >
                                <span class="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </a>
                        {/each}
                    </nav>

                    <div class="mt-auto">
                        <div class="p-4 rounded-lg bg-gray-700/30">
                            <p class="text-sm text-gray-400">
                                Share your code snippets securely and easily with CodeDrop
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</header>

<style>
    /* Add custom styles for webkit scrollbar if needed */
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
</style>