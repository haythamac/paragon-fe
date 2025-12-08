<script setup>
import { ref } from 'vue'
import glowing from '../assets/images/eyes.png'

import CTAButton from '@/components/common/CTAButton.vue'
import HeroContent from '@/components/layout/HeroContent.vue'
import HeroMedia from '@/components/layout/HeroMedia.vue'
import NavBar from '@/components/layout/NavBar.vue'

</script>

<template>
	<section class="relative min-h-[100vh] overflow-hidden bg-[#09040f] text-white">

		<!-- Top-centered floating navbar -->
		<NavBar />

		<!-- Hero content -->
		<div class="mx-auto max-w-7xl px-6 py-28 md:py-32 grid md:grid-cols-2 gap-10 items-center">
			<HeroContent
				title="Paragon Management"
				subtitle="Track all boss spawns, schedule guild bosses, manage member rosters, and coordinate events—all in one place."
				description=""
				>
				<template #actions>
					<CTAButton variant="solid" size="md" to="/games">Game Lists</CTAButton>
					<CTAButton variant="outline" size="md" href="/join">Join Discord</CTAButton>
				</template>
    		</HeroContent>

    		<HeroMedia :src="glowing" alt="glowing eyes" />
		</div>

		<!-- scroll hint -->
		<div class="absolute bottom-6 w-full flex justify-center">
			<div class="text-white/70 text-sm">Scroll to learn more ↓</div>	
		</div>
	</section>
</template>

<!-- Note: styling uses Tailwind utility classes. Replace CSS variables or move theme tokens to global Tailwind config as needed. -->

