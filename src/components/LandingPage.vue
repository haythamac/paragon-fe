<script setup>
import { ref } from 'vue'

const mobileOpen = ref(false)
function toggleMenu() { mobileOpen.value = !mobileOpen.value }
</script>

<template>
	<section class="relative min-h-[80vh] overflow-hidden bg-[--hero-bg]">

		<!-- Top-centered floating navbar -->
		<nav class="absolute left-1/2 top-8 -translate-x-1/2 z-40 w-[min(1100px,calc(100%-2rem))]">
			<div class="bg-white/95 backdrop-blur rounded-xl shadow-md p-3 flex items-center gap-4">
				<div class="font-semibold">Paragon</div>

				<ul class="hidden md:flex gap-6 flex-1 justify-center items-center text-sm">
					<li><a class="text-gray-700 hover:text-gray-900" href="#">Features</a></li>
					<li><a class="text-gray-700 hover:text-gray-900" href="#">Pricing</a></li>
					<li><a class="text-gray-700 hover:text-gray-900" href="#">Docs</a></li>
					<li><a class="text-gray-700 hover:text-gray-900" href="#">Contact</a></li>
				</ul>

				<div class="ml-auto flex items-center gap-3">
					<button class="hidden md:inline-flex bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium">Get Started</button>
					<button class="md:hidden p-2" @click="toggleMenu" aria-label="Toggle menu">
						<svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
					</button>
				</div>
			</div>

			<!-- Mobile dropdown -->
			<div v-if="mobileOpen" class="mt-2 md:hidden bg-white rounded-lg shadow-md p-4">
				<ul class="flex flex-col gap-3 text-sm">
					<li><a class="text-gray-700" href="#">Features</a></li>
					<li><a class="text-gray-700" href="#">Pricing</a></li>
					<li><a class="text-gray-700" href="#">Docs</a></li>
					<li><a class="text-gray-700" href="#">Contact</a></li>
					<li><button class="w-full mt-2 bg-indigo-600 text-white px-3 py-2 rounded-md">Get Started</button></li>
				</ul>
			</div>
		</nav>

		<!-- Hero content -->
		<div class="mx-auto max-w-7xl px-6 py-28 md:py-32 grid md:grid-cols-2 gap-10 items-center">
			<div class="space-y-6">
				<h1 class="text-4xl md:text-5xl font-bold leading-tight">Headline goes here</h1>
				<p class="text-gray-600 max-w-prose">Short description that supports the headline. Keep it concise and persuasive — switch in your real copy later.</p>
				<div class="flex flex-wrap gap-3">
					<button class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm">Primary Action</button>
					<button class="border border-gray-200 px-4 py-2 rounded-lg">Secondary Action</button>
				</div>
			</div>

			<div class="flex items-center justify-center">
				<div class="w-full rounded-2xl h-80 md:h-[420px] bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center text-gray-400 font-semibold shadow-lg">
					Image / Illustration
				</div>
			</div>
		</div>

		<!-- scroll hint -->
		<div class="absolute bottom-6 w-full flex justify-center">
			<div class="text-gray-500 text-sm">Scroll to learn more ↓</div>
		</div>
	</section>
</template>

<!-- Note: styling uses Tailwind utility classes. Replace CSS variables or move theme tokens to global Tailwind config as needed. -->

