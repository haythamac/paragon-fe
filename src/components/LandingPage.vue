<script setup>
import { ref } from 'vue'
import glowing from '../assets/images/eyes.png'

const mobileOpen = ref(false)
function toggleMenu() { mobileOpen.value = !mobileOpen.value }
</script>

<template>
	<section class="relative min-h-[100vh] overflow-hidden bg-[#09040f] text-(--text-secondary)">

		<!-- Top-centered floating navbar -->
		<nav class="absolute inset-x-0 top-8 z-40">
			<div class="mx-auto max-w-7xl px-6">
			<div class="bg-[#0b0b0d] border border-gray-700 rounded-xl shadow-md p-3 flex items-center gap-4">
				<div class="font-semibold text-(--text-secondary)">Paragon</div>

				<ul class="hidden md:flex gap-16 flex-1 justify-center items-center text-sm">
					<li><a class="text-(--text-secondary) hover:text-(--text-secondary)" href="#">Games</a></li>
					<li><a class="text-(--text-secondary) hover:text-(--text-secondary)" href="#">Members</a></li>
					<li><a class="text-(--text-secondary) hover:text-(--text-secondary)" href="#">Events</a></li>
					<li><a class="text-(--text-secondary) hover:text-(--text-secondary)" href="#">About</a></li>
				</ul>

				<div class="ml-auto flex items-center gap-3">
					<button class="hidden md:inline-flex bg-(--color-primary) text-(--text-primary) px-3 py-1.5 rounded-md text-sm font-medium">Join Discord</button>
					<button class="md:hidden p-2" @click="toggleMenu" aria-label="Toggle menu">
						<svg class="w-6 h-6 text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
					</button>
				</div>
			</div>

			<!-- Mobile dropdown -->
			<div v-if="mobileOpen" class="mt-2 md:hidden bg-[#0b0b0d] border border-gray-700 rounded-lg shadow-md p-4">
				<ul class="flex flex-col gap-3 text-sm">
					<li><a class="text-(--text-secondary)" href="#">Features</a></li>
					<li><a class="text-(--text-secondary)" href="#">Pricing</a></li>
					<li><a class="text-(--text-secondary)" href="#">Docs</a></li>
					<li><a class="text-(--text-secondary)" href="#">Contact</a></li>
					<li><button class="w-full mt-2 bg-(--color-primary) text-(--text-dark-button) px-3 py-2 rounded-md">Join Discord</button></li>
				</ul>
			</div>
			</div>
		</nav>

		<!-- Hero content -->
		<div class="mx-auto max-w-7xl px-6 py-28 md:py-32 grid md:grid-cols-2 gap-10 items-center">
			<div class="space-y-6 gap-8 flex flex-col">
				<h1 class="text-4xl md:text-5xl font-bold leading-tight text-(--text-primary)">Paragon Management</h1>
				<p class="text-xl text-(--text-secondary) max-w-prose">
					Track all boss spawns, schedule guild bosses, 
					manage member rosters, and coordinate events—all in one place.
				</p>
				<!-- Winning matters, but fun matters more. -->
				<div class="flex flex-wrap gap-3">
					<button class="bg-(--color-primary) text-(--text-primary) px-4 py-2 rounded-lg shadow-sm">Game Lists</button>
				</div>
			</div>

			<div class="flex items-center justify-center">
					<img :src="glowing" alt="glowing eyes" class="" />
				
			</div>
		</div>

		<!-- scroll hint -->
		<div class="absolute bottom-6 w-full flex justify-center">
			<div class="text-(--text-secondary)/70 text-sm">Scroll to learn more ↓</div>
		</div>
	</section>
</template>

<!-- Note: styling uses Tailwind utility classes. Replace CSS variables or move theme tokens to global Tailwind config as needed. -->

