<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import '../app.pcss';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import Footer from './components/Footer.svelte';
	import Header from './components/Header.svelte';
	import { Avatar } from 'flowbite-svelte';
  
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    inject({ mode: dev ? 'development' : 'production' });

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
			},
			{
				name: "Janmejay Pandya",
				githubId: "Janmejay-Pandya"
			},
			{
				name: "Skater Crow",
				githubId: "SkaterCrow"
			},
			{
				name: "Mihir Hebalkar",
				githubId: "mihirhebalkar"
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

<div class="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
	<Header />

	<main class="flex-grow px-4 py-8 md:px-6 lg:px-8" style="min-height: calc(100vh - 145px);">
		<slot></slot>
	</main>

	<section class="container mx-auto px-4 py-12 bg-gray-900/50 backdrop-blur-sm rounded-t-3xl shadow-2xl">
		<h2 class="text-3xl font-bold text-center text-white mb-8 relative">
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
					class="group flex items-center space-x-4 p-4 bg-gray-800/80 hover:bg-gray-700/80 
						   border border-gray-700 rounded-xl transition-all duration-300 
						   hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1"
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

<style>
	:global(body) {
		@apply bg-gray-900;
		scroll-behavior: smooth;
	}

	main {
		backdrop-filter: blur(8px);
	}

	.container {
		max-width: 1440px;
	}

	@keyframes gradient {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
</style>
