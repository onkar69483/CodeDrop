<script>
	let isOpen = false;
  
	function toggleMenu() {
	  isOpen = !isOpen;
	}
</script>

<header class="sticky top-0 z-50 bg-gray-800 dark:bg-gray-900 shadow-lg">
	<div class="container mx-auto flex justify-between items-center p-4">
		<a href="/" class="text-3xl font-bold text-white tracking-wide hover:text-indigo-500 transition duration-300 ease-in-out" style="font-family: 'Dancing Script', cursive;">
			CodeDrop
		</a>

		<!-- Mobile Menu Button -->
		<button class="lg:hidden text-white focus:outline-none" on:click={toggleMenu}>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
			</svg>
		</button>

		<!-- Desktop Menu -->
		<nav class="hidden lg:flex lg:items-center lg:space-x-6">
			<a href="/#create-pastes" class="text-md text-gray-200 hover:text-indigo-400 transition duration-300 ease-in-out">Create Pastes</a>
			<a href="/#recent-pastes" class="text-md text-gray-200 hover:text-red-400 transition duration-300 ease-in-out">Recent Pastes</a>
		</nav>

		<!-- Mobile Menu Overlay -->
		<div class={`fixed inset-0 bg-gray-800 dark:bg-gray-900 bg-opacity-75 lg:hidden ${isOpen ? 'block' : 'hidden'} transition-opacity duration-300`} on:click={toggleMenu}>
			<!-- Mobile Menu Container -->
			<div class="relative bg-gray-800 dark:bg-gray-900 mx-auto mt-16 p-4 rounded-lg shadow-lg" on:click|stopPropagation>
				<button class="absolute top-4 right-4 text-white" on:click={toggleMenu}>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
				<nav class="flex flex-col space-y-4">
					<a href="/#create-pastes" class="text-md text-gray-200 hover:text-indigo-400 transition duration-300 ease-in-out" on:click={toggleMenu}>Create Pastes</a>
					<a href="/#recent-pastes" class="text-md text-gray-200 hover:text-red-400 transition duration-300 ease-in-out" on:click={toggleMenu}>Recent Pastes</a>
				</nav>
			</div>
		</div>
	</div>
</header>