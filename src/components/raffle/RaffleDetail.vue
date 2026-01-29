<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import NavBar from '../layout/NavBar.vue';
import GeneralInformation from './raffle details/GeneralInformation.vue';
import Participants from './raffle details/Participants.vue';
import PrizeItems from './raffle details/PrizeItems.vue';
import { raffleAPI } from '@/services/raffleAPI';

const currentRaffle = ref([]);

onMounted(async () => {
    const route = useRoute();
    const raffleId = route.params.id;

    try {
        const raffleResponse = await raffleAPI.getById(raffleId);

        currentRaffle.value = raffleResponse.data.data;
    } catch (error) {
        console.error('Error fetching raffle details:', error);
    }
    
    document.title = 'Raffle Details - Paragon';
});


</script>

<template>
    <section class="relative min-h-screen overflow-hidden bg-[#09040f] text-white">

        <!-- Top-centered floating navbar -->
        <NavBar />

        <div class="mx-auto max-w-7xl px-6 py-28 gap-8 flex flex-col">
            <!-- Raffle General Information -->
            <GeneralInformation 
                title="8th Weekly Raffle Event" 
                date="2026-01-26"
                description="Guild Sanctuary Weekly Raffle"
                status="in-progress" 
                :totalParticipants="50" 
                :prizeItems="35" 
                :coreItems="6" 
                :totalPrizes="89" />

            <!-- Raffle Participants List -->
            <Participants />

            <!-- Raffle Prize Items List -->
            <PrizeItems />
        </div>
    </section>

</template>