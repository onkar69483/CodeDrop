<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import '../app.pcss';
	// import HeaderBanner from './HeaderBanner.svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	// import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	
	import Footer from './components/Footer.svelte';
	import Header from './components/Header.svelte';
	import { Avatar } from 'flowbite-svelte';
  
  // Import the Analytics package, and the SvelteKit dev variable.
  import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';

    // Inject the Analytics functionality
    inject({ mode: dev ? 'development' : 'production' });

	const data = {
    "contributors": [
      {
        "name": "Onkar Mendhapurkar",
        "githubId": "onkar69483"
      },
      {
        "name": "Sachin Mhetre",
        "githubId": "sachinmhetre678"
      },
      {
        "name": "Garv Kalra",
        "githubId": "garvkalra"
      },
      {
        "name": "Atharva Sawant",
        "githubId": "atharvasawant09"
      }
    ]
  }
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
	<!-- Consider replacing "https://example.com/codedrop-thumbnail.jpg" with the actual URL of your project's thumbnail image -->
  <!-- Meta tags for google and bing se verification -->
  <meta name="msvalidate.01" content="F08D096601151AB3C3750560588DF846" />
  <meta name="google-site-verification" content="NMPuB4hQ0zdn4BHUE1VCLXUghfnICKisubXfYqcqR3U" />
  <meta name="google-site-verification" content="mWv4cDb2ZnB3SzBkAkn2lhTRwLEEvQrIAJkPjOyFmwQ" />
  <!-- Importing Google Fonts -->
	<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
</svelte:head>

<Header />

<main class="bg-gray-900 dark:bg-gray-900" style="min-height: calc(100vh - 145px);">
	<slot></slot>
</main>

<div class="flex flex-col items-center mt-8 px-4">
    <h2 class="mb-4 text-2xl font-extrabold tracking-tight leading-none text-white dark:text-white">
        Contributors
    </h2>
    <div class="flex flex-wrap justify-center gap-4">
        {#each data.contributors as contributor}
            <a
                href="https://github.com/{contributor.githubId}"
                target="_blank"
                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-900 bg-gray-100 dark:bg-gray-800 border-primary-400 rounded-lg shadow-lg transform transition-transform hover:scale-105 w-full sm:w-auto"
            >
                <Avatar src="https://github.com/{contributor.githubId}.png" size="md"/>
                <div class="text-sm font-medium text-gray-800 dark:text-white">
                    {contributor.name}
                </div>
            </a>
        {/each}
    </div>
</div>


<Footer />