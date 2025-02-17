<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import '../app.pcss';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import Footer from './components/Footer.svelte';
	import Header from './components/Header.svelte';
	import { Avatar } from 'flowbite-svelte';
	import { onMount } from 'svelte';
  
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    inject({ mode: dev ? 'development' : 'production' });

    let mounted = false;
    let mouseX = 0;
    let mouseY = 0;

    // Parallax effect
    function handleMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 20;
        
        // Custom cursor position
        if (cursorDot && cursorOutline) {
            // Position the dot at the exact cursor position
            cursorDot.style.left = `${event.clientX}px`;
            cursorDot.style.top = `${event.clientY}px`;
            
            // Add a smooth transition for the outline
            cursorOutline.animate({
                left: `${event.clientX}px`,
                top: `${event.clientY}px`
            }, { duration: 500, fill: 'forwards', easing: 'ease' });
        }
    }

    // Custom cursor variables
    let cursorDot;
    let cursorOutline;
    let clickRipples = [];

    // Click effect handler
    function handleClick(event) {
        createClickRipple(event.clientX, event.clientY);
    }

    // Create ripple effect on click
    function createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    onMount(() => {
        mounted = true;
        
        // Create custom cursor elements
        cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);
        
        cursorOutline = document.createElement('div');
        cursorOutline.className = 'cursor-outline';
        document.body.appendChild(cursorOutline);
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Add hover effect to all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('cursor-hover');
                cursorOutline.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('cursor-hover');
                cursorOutline.classList.remove('cursor-hover');
            });
        });
        
        // Add document-wide click listener for ripple effect
        document.addEventListener('click', handleClick);
        
        return () => {
            // Cleanup on component unmount
            document.removeEventListener('click', handleClick);
            if (cursorDot) cursorDot.remove();
            if (cursorOutline) cursorOutline.remove();
            document.body.style.cursor = 'auto';
        };
    });

	const data = {
		contributors: [
			{
				name: "Onkar Mendhapurkar",
				githubId: "onkar69483"
			},
			{
				name: "Sachin Mhetre",
				githubId: "sachinmhetre678"
			},
			{
				name: "Garv Kalra",
				githubId: "garvkalra"
			},
			{
				name: "Atharva Sawant",
				githubId: "atharvasawant09"
			},
			{
				name: "Aryan Bachute",
				githubId: "Aryanfour5"
			}
		]
	};
</script>

<svelte:head>
	<title>CodeDrop — Paste and Share Code Snippets Easily</title>
	<meta name="title" content="CodeDrop — Paste and Share Code Snippets Easily" />
	<meta
		name="description"
		content="CodeDrop allows you to easily paste and share code snippets with others. Set expiration times for automatic deletion and ensure secure, temporary sharing. Perfect for quick collaborations and ephemeral exchanges."
	/>
	<meta name="keywords" content="CodeDrop, code sharing, code snippets, paste code, share code, temporary code sharing, secure code sharing, quick collaborations" />
	<meta property="og:image" content="https://raw.githubusercontent.com/onkar69483/CodeDrop/main/static/thumbnail.png" />
	<meta name="msvalidate.01" content="F08D096601151AB3C3750560588DF846" />
	<meta name="google-site-verification" content="NMPuB4hQ0zdn4BHUE1VCLXUghfnICKisubXfYqcqR3U" />
	<meta name="google-site-verification" content="mWv4cDb2ZnB3SzBkAkn2lhTRwLEEvQrIAJkPjOyFmwQ" />
	<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} on:click={handleClick}/>

<div class="relative min-h-screen bg-gray-900 text-white overflow-hidden">
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <!-- Gradient background -->
        <div class="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20"></div>
        
        <!-- Animated mesh gradient -->
        <div 
            class="absolute inset-0 opacity-30"
            style="background: radial-gradient(circle at {50 + mouseX}% {50 + mouseY}%, rgba(56, 189, 248, 0.3) 0%, rgba(59, 130, 246, 0.3) 25%, rgba(147, 51, 234, 0.3) 50%, rgba(79, 70, 229, 0.3) 75%, transparent 100%)"
        ></div>

        <!-- Animated particles -->
        {#if mounted}
            {#each Array(20) as _, i}
                <div
                    class="absolute w-1 h-1 bg-white rounded-full"
                    style="
                        left: {Math.random() * 100}%;
                        top: {Math.random() * 100}%;
                        opacity: {Math.random() * 0.3};
                        animation: sparkle {3 + Math.random() * 5}s infinite ease-in-out;
                    "
                ></div>
            {/each}
        {/if}
    </div>

    <!-- Main content -->
    <div class="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main class="flex-grow px-4 py-8 md:px-6 lg:px-8 backdrop-blur-sm" style="min-height: calc(100vh - 145px);">
            <slot></slot>
        </main>

        <section class="container mx-auto px-4 py-12 bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-gray-700/50">
            <h2 class="text-3xl font-bold text-center text-white mb-12 relative">
                <span class="relative inline-block">
                    Contributors
                    <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </span>
            </h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {#each data.contributors as contributor}
                    <a
                        href="https://github.com/{contributor.githubId}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group flex items-center space-x-4 p-4 bg-gray-800/40 hover:bg-gray-700/40 
                               border border-gray-700/50 rounded-xl transition-all duration-300 
                               hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 backdrop-blur-md"
                    >
                        <div class="relative">
                            <Avatar
                                src="https://github.com/{contributor.githubId}.png"
                                class="ring-2 ring-blue-500/50 group-hover:ring-blue-500 transition-all duration-300"
                                size="md"
                            />
                            <div class="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                                {contributor.name}
                            </span>
                            <span class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                @{contributor.githubId}
                            </span>
                        </div>
                    </a>
                {/each}
            </div>
        </section>

        <Footer />
    </div>
</div>

<style>
	:global(body) {
		@apply bg-gray-900;
		scroll-behavior: smooth;
		overflow-x: hidden;
	}

	.container {
		max-width: 1440px;
	}

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
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	:global(.hover\:shadow-glow:hover) {
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
	}

    /* Custom cursor styles */
    :global(.cursor-dot) {
        position: fixed;
        width: 8px;
        height: 8px;
        background-color: #60a5fa;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(96, 165, 250, 0.7);
    }

    :global(.cursor-outline) {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(96, 165, 250, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, border-color 0.3s;
    }

    /* Cursor hover effect for interactive elements */
    :global(.cursor-hover.cursor-dot) {
        background-color: #3b82f6;
        width: 12px;
        height: 12px;
        mix-blend-mode: multiply;
    }

    :global(.cursor-hover.cursor-outline) {
        width: 60px;
        height: 60px;
        border-color: #3b82f6;
        background-color: rgba(59, 130, 246, 0.1);
    }

    /* Click ripple effect */
    :global(.click-ripple) {
        position: fixed;
        width: 10px;
        height: 10px;
        background-color: rgba(96, 165, 250, 0.7);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9997;
        transform: translate(-50%, -50%);
        animation: ripple-effect 1s ease-out forwards;
    }

    @keyframes ripple-effect {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    /* Add this to ensure links and buttons work properly with custom cursor */
    :global(a), :global(button), :global(input), :global(textarea), :global(select), :global([role="button"]) {
        cursor: none !important;
    }
    
    /* For touch devices, disable the custom cursor */
    @media (hover: none) {
        :global(.cursor-dot), :global(.cursor-outline), :global(.click-ripple) {
            display: none !important;
        }
        
        :global(body) {
            cursor: auto !important;
        }
        
        :global(a), :global(button), :global(input), :global(textarea), :global(select), :global([role="button"]) {
            cursor: auto !important;
        }
    }
</style>