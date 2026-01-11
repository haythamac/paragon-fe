<script setup>
import { ref } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import MemberGroup from '@/components/members/MemberGroup.vue';
import CTAButton from '@/components/common/CTAButton.vue';

</script>

<template>
	<section class="relative min-h-screen overflow-hidden bg-[#09040f] text-white">

		<!-- Top-centered floating navbar -->
		<NavBar />

		<!-- Hero content -->
		<div class="mx-auto max-w-7xl px-6 py-28 md:py-32 grid md:grid-cols-1 gap-10 items-center">
			<div class="">
				<button @click="addMemberOpen = true" class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm">Add Member</button>
			</div>
			<MemberGroup
				groupName="Leader"
			 :members="[
			   { id: 1, name: 'Black', power: 9999, level: 1000, class: 'Archer' },
			 ]"
			 :count="1"
			/>
			<MemberGroup
				groupName="Elders"
			 :members="[
			   { id: 1, name: 'Scam2p', power: 8500, level: 950, class: 'Chinese' },
			   { id: 2, name: 'Laravel', power: 8300, level: 940, class: 'Archer' },
			   { id: 1, name: 'Avigf', power: 8500, level: 950, class: 'Bisaya' },
			   { id: 2, name: 'Golti', power: 8300, level: 940, class: 'Archer' },
			   { id: 1, name: 'Tap', power: 8500, level: 950, class: 'Bisaya' },
			   { id: 2, name: 'Kioshi', power: 8300, level: 940, class: 'Archer' },
			   { id: 2, name: 'IMBAno', power: 8300, level: 940, class: 'Bisaya' },
			 ]"
			 :count="7"
			/>

			<MemberGroup
				groupName="Members"
			 :members="[
			   { id: 1, name: 'Scam2p', power: 8500, level: 950, class: 'Archer' },
			   { id: 2, name: 'Laravel', power: 8300, level: 940, class: 'Archer' },
			   { id: 1, name: 'Avigf', power: 8500, level: 950, class: 'Bisaya' },
			   { id: 2, name: 'Golti', power: 8300, level: 940, class: 'Archer' },
			   { id: 1, name: 'Tap', power: 8500, level: 950, class: 'Bisaya' },
			   { id: 2, name: 'Kioshi', power: 8300, level: 940, class: 'Archer' },
			   { id: 2, name: 'IMBAno', power: 8300, level: 940, class: 'Bisaya' },
			   { id: 1, name: 'Scam2p', power: 8500, level: 950, class: 'Archer' },
			   { id: 2, name: 'Laravel', power: 8300, level: 940, class: 'Archer' },
			   { id: 1, name: 'Avigf', power: 8500, level: 950, class: 'Bisaya' },
			   { id: 2, name: 'Golti', power: 8300, level: 940, class: 'Archer' },
			   { id: 1, name: 'Tap', power: 8500, level: 950, class: 'Bisaya' },
			   { id: 2, name: 'Kioshi', power: 8300, level: 940, class: 'Archer' },
			   { id: 2, name: 'IMBAno', power: 8300, level: 940, class: 'Bisaya' },
			 ]"
			 :count="14"
			/>
		</div>

		
	</section>
</template>


