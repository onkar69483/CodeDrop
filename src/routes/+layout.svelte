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
</script>

<svelte:head>
	<title>CodeDrop — Paste and Share Code Snippets Easily</title>
	<meta name="title" content="CodeDrop — Paste and Share Code Snippets Easily" />
	<meta
		name="description"
		content="CodeDrop allows you to easily paste and share code snippets with others. Set expiration times for automatic deletion and ensure secure, temporary sharing. Perfect for quick collaborations and ephemeral exchanges."
	/>
	<meta name="keywords" content="CodeDrop, code sharing, code snippets, paste code, share code, temporary code sharing, secure code sharing, quick collaborations" />
	<meta property="og:image" content="https://example.com/codedrop-thumbnail.jpg" />
	<!-- Consider replacing "https://example.com/codedrop-thumbnail.jpg" with the actual URL of your project's thumbnail image -->
    <!-- Importing Google Fonts -->
	<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
</svelte:head>

<Header />

<main class="bg-white dark:bg-gray-900" style="min-height: calc(100vh - 145px);">
	<slot></slot>
</main>

<Footer />
