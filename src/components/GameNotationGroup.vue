<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { computed, ref } from 'vue';
import GameNotation from './GameNotation.vue';
import { renderNotationInput } from '@/common/helpers';
import LegendOverlay from './LegendOverlay.vue';
import HelpCircleOutlineIcon from './icons/HelpCircleOutlineIcon.vue';

export default {
    setup() {
        const gameStore = useGameStore();
        const gameNotations = computed(() => gameStore.gameNotations);

        const showLegendOverlay = ref(false);
        const openLegendOverlay = () => {
            showLegendOverlay.value = true;
            console.log('test');
        }

        const closeLegendOverlay = () => {
            showLegendOverlay.value = false;
        }

        return {
            gameStore,
            gameNotations,
            renderNotationInput,
            showLegendOverlay,
            openLegendOverlay,
            closeLegendOverlay
        }
    },
    components: {
        GameNotation,
        LegendOverlay,
        HelpCircleOutlineIcon
    }
}
</script>
<template lang="">
    <div>
        <div class="flex flex-row justify-between items-center mb-2">
            <p class="text-white font-bold">Game notations:</p>
            <LegendOverlay
                :showLegendOverlay="showLegendOverlay === true"
                :helpIconStyles="['text-white', 'h-10', 'w-10', 'fill-white']"
                :descriptionsStyles="['text-white']"
                @trigger-close-legend-overlay="closeLegendOverlay()"
            />
            <HelpCircleOutlineIcon class="text-white fill-white h-8 w-8" @click="openLegendOverlay()"/>
        </div>
        <div class="grid grid-rows-2 grid-cols-5 items-center justify-center">
            <div
                v-for="gameNotation in gameNotations"
                :key="gameNotation.id"       
                class="border bg-green p-1 text-center w-full h-full"
                @click="renderNotationInput(gameNotation)"
            >
                <GameNotation
                    :notation="gameNotation.notation"
                    :iconFileName="gameNotation.icon_file_name"
                    class="fill-white text-white"
                />
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>