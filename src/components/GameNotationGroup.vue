<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { computed, ref } from 'vue';
import GameNotation from './GameNotation.vue';
import { renderNotationInput } from '@/common/helpers';
import LegendOverlay from './LegendOverlay.vue';
import HelpCircleOutlineIcon from './icons/HelpCircleOutlineIcon.vue';
import ChevronBackOutlineIcon from './icons/ChevronBackOutlineIcon.vue';
import ChevronForwardOutlineIcon from './icons/ChevronForwardOutlineIcon.vue';

export default {
    setup() {
        const gameStore = useGameStore();
        const characterStore = useCharacterStore();
        const gameNotations = computed(() => gameStore.gameNotations);
        const characterNotations = computed(() => characterStore.character.notations);

        const currentPage = ref(1);
        const itemsPerPage = 25;

        const totalNotations = computed(() => {
            return [...characterStore.character.notations, ...gameStore.gameNotations];
        });

        const paginatedNotations = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return totalNotations.value.slice(start,end);
        });

        const totalPages = computed(() => {
            return Math.ceil(totalNotations.value.length / itemsPerPage);
        });

        const goToNextPage = () => {
            if(currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        const goToPreviousPage = () => {
            if(currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const showNotationLegendOverlay = ref(false);
        const openNotationLegendOverlay = () => {
            showNotationLegendOverlay.value = true;
        };

        const closeNotationLegendOverlay = () => {
            showNotationLegendOverlay.value = false;
        };

        return {
            gameStore,
            gameNotations,
            renderNotationInput,
            showNotationLegendOverlay,
            openNotationLegendOverlay,
            closeNotationLegendOverlay,
            characterNotations,
            currentPage,
            totalPages,
            goToNextPage,
            goToPreviousPage,
            paginatedNotations
        }
    },
    components: {
        GameNotation,
        LegendOverlay,
        HelpCircleOutlineIcon,
        ChevronBackOutlineIcon,
        ChevronForwardOutlineIcon
    }
}
</script>
<template lang="">
    <div>
        <div class="flex flex-row justify-between items-center mb-2">
            <p class="text-white font-bold">Game notations:</p>
            <LegendOverlay
                :showLegendOverlay="showNotationLegendOverlay === true"
                :showGameNotations="true"
                :showAttackButtons="false"
                :closeIconStyles="['text-white', 'h-20', 'w-20', 'fill-white']"
                :descriptionsStyles="['text-white', 'text-lg']"
                :descriptionsContainerStyles="['space-y-4', 'overflow-y-auto', 'xs:h-[42rem]', 'pb-[5rem]']"
                @trigger-close-legend-overlay="closeNotationLegendOverlay()"
            />
            <HelpCircleOutlineIcon class="text-white fill-white h-8 w-8" @click="openNotationLegendOverlay()"/>
        </div>
        <div class="flex flex-row space-x-2 justify-center items-center">
            <button @click="goToPreviousPage" :disabled="currentPage <= 1" >
                <ChevronBackOutlineIcon class="h-8 w-8 text-white fill-white" :class="{'text-dark-gray': currentPage <= 1}"/>
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="goToNextPage" :disabled="currentPage >= totalPages">
                <ChevronForwardOutlineIcon class="h-8 w-8 text-white fill-white" :class="{'text-dark-gray': currentPage >= totalPages}"/>
            </button>
        </div>
        <div class="grid grid-rows-2 grid-cols-5 items-center justify-center">
            <div
                v-for="notation in paginatedNotations"
                :key="notation.id"       
                class="border p-1 text-center w-full h-full"
                :class="{ 
                    'bg-apex-blue' : notation.notations_group === 'character', 
                    'bg-green' : notation.notations_group === 'other'
                }"
                @click="renderNotationInput(notation)"
            >
                <GameNotation
                    :notation="notation.notation"
                    :iconFileName="notation.icon_file_name"
                    class="fill-white text-white"
                />
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>