<script setup>
import NavBar from '../layout/NavBar.vue';
import GeneralInformation from './raffle details/GeneralInformation.vue';


</script>

<template>
    <section class="relative min-h-[100vh] overflow-hidden bg-[#09040f] text-white">

		<!-- Top-centered floating navbar -->
		<NavBar />  

        <!-- Raffle General Information -->
		<GeneralInformation 
        title="Spring Festival Mega Raffle 2026" 
        date="2026-03-20"
        description="Welcome to our biggest raffle event yet! With amazing prizes and participation from our entire community. All registered members will participate in the draw. Stay tuned for the announcement!"
        status="pending" 
        :totalParticipants="50" 
        :prizeItems="35" 
        :coreItems="6" 
        :totalPrizes="89" />
	</section>
    
</template>