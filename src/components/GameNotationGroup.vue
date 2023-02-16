<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { computed } from 'vue';
import GameNotation from './GameNotation.vue';
import { renderNotationInput } from '@/common/helpers';

export default {
    setup() {
        const gameStore = useGameStore();
        const gameNotations = computed(() => gameStore.gameNotations);

        return {
            gameStore,
            gameNotations,
            renderNotationInput
        }
    },
    components: {
        GameNotation
    }
}
</script>
<template lang="">
    <div class="grid grid-rows-2 grid-cols-3 items-center justify-center">
        <div
            v-for="gameNotation in gameNotations"
            :key="gameNotation.id"       
            class="border bg-green-500 p-2 text-center w-full h-full"
            @click="renderNotationInput(gameNotation)"
        >
            <GameNotation

                :notation="gameNotation.notation"
                :iconFileName="gameNotation.icon_file_name"
                class="fill-white"


            />
        </div>
    </div>

</template>
<style lang="">
    
</style>