<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import NavBar from '../layout/NavBar.vue';
import GeneralInformation from './raffle details/GeneralInformation.vue';
import Participants from './raffle details/Participants.vue';
import PrizeItems from './raffle details/PrizeItems.vue';
import ChangeStatus from './raffle details/ChangeStatus.vue'

import { raffleAPI } from '@/services/raffleAPI';

const currentRaffle = ref([]);
const raffleMembers = ref([]);
const raffleItems = ref([]);
const raffleId = ref(null);

const fetchRaffleData = async () => {
    try {
        const raffleResponse = await raffleAPI.getById(raffleId.value);
        currentRaffle.value = raffleResponse.data.data;
        raffleMembers.value = raffleResponse.data.data.members;
        raffleItems.value = raffleResponse.data.data.items;

        // console.log(raffleItems.value)
    } catch (error) {
        console.error('Error fetching raffle details:', error);
    }
}

onMounted(async () => {
    const route = useRoute();
    raffleId.value = route.params.id;
    await fetchRaffleData();
    document.title = 'Raffle Details - Paragon';
});

const handleStatusChanged = async (newStatus) => {
    currentRaffle.value.status = newStatus
    await fetchRaffleData()
}

</script>

<template>
    <section class="relative min-h-screen overflow-hidden bg-[#09040f] text-white">

        <!-- Top-centered floating navbar -->
        <NavBar />

        

        <div class="mx-auto max-w-7xl px-6 py-28 gap-8 flex flex-col">
            <!-- Status Change -->
            <ChangeStatus v-if="currentRaffle && currentRaffle.id" :raffleId="currentRaffle.id" :currentStatus="currentRaffle.status"
            @statusChanged="handleStatusChanged" />

            <!-- Raffle General Information -->
            <GeneralInformation :title="currentRaffle.name" :date="currentRaffle.date"
                :description="currentRaffle.description || 'No description provided.'" :status="currentRaffle.status"
                :totalParticipants="raffleMembers.length" :prizeItems="raffleItems.length" :coreItems="6"
                :totalPrizes="89" />

            <!-- Raffle Participants List -->
            <Participants :participants="raffleMembers" :totalCount="raffleMembers.length" :items="raffleItems"
                :raffleId="raffleId" @refresh="fetchRaffleData" />

            <!-- Raffle Prize Items List -->
            <PrizeItems :items="raffleItems" :raffleStatus="currentRaffle.status" :raffleId="raffleId" />
        </div>
    </section>

</template>