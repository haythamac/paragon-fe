<script setup>
import { onMounted, ref, computed } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import MemberGroup from '@/components/members/MemberGroup.vue';
import AddMember from '@/components/members/AddMember.vue';
import { memberAPI } from '@/services/memberAPI';

const loading = ref(false)
const error = ref('')
const members = ref([]);
const memberGroups = ref({});

const roleLabels = {
  leader: 'Leader',
  elder: 'Elders',
  agent: 'Agents',
  member: 'Members',
  new_member: 'New Members',
}

const roleOrder = [
  'leader',
  'elder',
  'agent',
  'member',
  'new_member',
]

onMounted(async () => {
	loading.value = true;
	try {
		const memberResponse = await memberAPI.getAll();
		members.value = memberResponse.data.data;
		console.log(members.value);
	}
	catch (err) {
		console.error(err)
		error.value = err
	} finally {
		loading.value = false;
	}
})

const groupedMembers = computed(() => {
  const groups = {}

  for (const member of members.value) {
    const role = member.role

    if (!groups[role]) {
      groups[role] = []
    }

    groups[role].push(member)
  }

  return groups
})

const orderedGroups = computed(() => {
  const result = []

  for (const role of roleOrder) {
    if (groupedMembers.value[role]) {
      result.push({
        role,
        members: groupedMembers.value[role],
      })
    }
  }

  return result
})

const hasMembers = computed(() => {
  return Object.keys(groupedMembers.value).length > 0
})

const addMemberOpen = ref(false)
</script>

<template>
	<section class="relative min-h-screen overflow-hidden bg-[#09040f] text-white">

		<!-- Top-centered floating navbar -->
		<NavBar />

		<!-- Hero content -->
		<div class="mx-auto max-w-7xl px-6 py-28 md:py-32 grid md:grid-cols-1 gap-10 items-center">
			<div class="">
				<button @click="addMemberOpen = true"
					class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm">Add Member</button>
			</div>
			<AddMember v-model="addMemberOpen" />
			<!-- NO MEMBERS -->
			<p v-if="!hasMembers" class="text-gray-400">
				No members yet
			</p>

			<!-- MEMBER GROUPS -->
			<MemberGroup
				v-for="group in orderedGroups"
				:key="group.role"
				:groupName="roleLabels[group.role]"
				:members="group.members"
				:count="group.members.length"
			/>

			<!-- <MemberGroup groupName="Leader" :members="[
				{ id: 1, name: 'Black', power: 9999, level: 1000, class: 'Archer' },
			]" :count="1" />
			<MemberGroup groupName="Elders" :members="[
				{ id: 1, name: 'Scam2p', power: 8500, level: 950, class: 'Chinese' },
			]" :count="7" />

			<MemberGroup groupName="Members" :members="[
				{ id: 1, name: 'Scam2p', power: 8500, level: 950, class: 'Archer' },
			]" :count="14" /> -->
		</div>


	</section>
</template>
