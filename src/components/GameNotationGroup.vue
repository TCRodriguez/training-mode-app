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

        const showNotationLegendOverlay = ref(false);
        const openNotationLegendOverlay = () => {
            showNotationLegendOverlay.value = true;
        }

        const closeNotationLegendOverlay = () => {
            showNotationLegendOverlay.value = false;
        }

        return {
            gameStore,
            gameNotations,
            renderNotationInput,
            showNotationLegendOverlay,
            openNotationLegendOverlay,
            closeNotationLegendOverlay
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
                :showLegendOverlay="showNotationLegendOverlay === true"
                :showGameNotations="true"
                :showAttackButtons="false"
                :closeIconStyles="['text-white', 'h-20', 'w-20', 'fill-white']"
                :descriptionsStyles="['text-white', 'text-lg']"
                :descriptionsContainerStyles="['space-y-4', 'overflow-y-auto', 'xs:h-[49rem]']"
                @trigger-close-legend-overlay="closeNotationLegendOverlay()"
            />
            <HelpCircleOutlineIcon class="text-white fill-white h-8 w-8" @click="openNotationLegendOverlay()"/>
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