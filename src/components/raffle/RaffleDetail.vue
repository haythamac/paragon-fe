<script setup>
import NavBar from '../layout/NavBar.vue';
import GeneralInformation from './raffle details/GeneralInformation.vue';
import Participants from './raffle details/Participants.vue';
import PrizeItems from './raffle details/PrizeItems.vue';


</script>

<template>
    <section class="relative min-h-screen overflow-hidden bg-[#09040f] text-white">

        <!-- Top-centered floating navbar -->
        <NavBar />

        <div class="mx-auto max-w-7xl px-6 py-28">


            <!-- Raffle General Information -->
            <GeneralInformation title="Spring Festival Mega Raffle 2026" date="2026-03-20"
                description="Welcome to our biggest raffle event yet! With amazing prizes and participation from our entire community. All registered members will participate in the draw. Stay tuned for the announcement!"
                status="pending" :totalParticipants="50" :prizeItems="35" :coreItems="6" :totalPrizes="89" />

            <!-- Raffle Participants List -->
            <Participants />

            <!-- Raffle Prize Items List -->
            <PrizeItems />
        </div>
    </section>

</template>