<script setup>
import { onMounted, ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import NavBar from '@/components/layout/NavBar.vue'
import MemberGroup from '@/components/members/MemberGroup.vue'
import AddMember from '@/components/members/AddMember.vue'
import EditMember from '@/components/members/EditMember.vue' // You'll need to create this
import { memberAPI } from '@/services/memberAPI'

const loading = ref(false)
const error = ref('')
const members = ref([])
const addMemberOpen = ref(false)
const editMemberOpen = ref(false)
const editingMember = ref(null)

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

const fetchMembers = async () => {
	loading.value = true
	try {
		const memberResponse = await memberAPI.getAll()
		// Filter only active members
		members.value = memberResponse.data.data.filter(m => m.status === 'active')
	}
	catch (err) {
		console.error(err)
		error.value = err
		toast.error('Failed to load members')
	} finally {
		loading.value = false
	}
}

onMounted(fetchMembers)

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

// Handle edit
const handleEdit = (memberId) => {
	editingMember.value = members.value.find(m => m.id === memberId)
	editMemberOpen.value = true
}

// Handle delete
const handleDelete = async (memberId) => {
	try {
		await memberAPI.delete(memberId)
		toast.success('Member deleted successfully')
		await fetchMembers()
	} catch (error) {
		console.error('Error deleting member:', error)
		toast.error('Failed to delete member')
	}
}

// Handle mark as inactive
const handleMarkInactive = async (memberId) => {
	try {
		await memberAPI.updateStatus(memberId, { status: 'inactive' })
		toast.success('Member marked as inactive')
		await fetchMembers()
	} catch (error) {
		console.error('Error updating status:', error)
		toast.error('Failed to update status')
	}
}
</script>

<template>
	<section class="relative min-h-screen overflow-hidden bg-[#09040f] text-white">
		<NavBar />

		<div class="mx-auto max-w-7xl px-6 py-28 md:py-32 grid md:grid-cols-1 gap-10 items-center">
			<div>
				<button @click="addMemberOpen = true"
					class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
					Add Member
				</button>
			</div>

			<AddMember v-model="addMemberOpen" @refresh="fetchMembers" />
			<EditMember v-model="editMemberOpen" :member="editingMember" @refresh="fetchMembers" />

			<p v-if="!hasMembers && !loading" class="text-gray-400">
				No members yet
			</p>

			<MemberGroup v-for="group in orderedGroups" :key="group.role" :groupName="roleLabels[group.role]"
				:members="group.members" :count="group.members.length" @edit="handleEdit" @delete="handleDelete"
				@mark-inactive="handleMarkInactive" />
		</div>
	</section>
</template>