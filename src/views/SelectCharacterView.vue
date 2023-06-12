<script lang="ts">
import Characters from "../components/CharacterList.vue";
import Notes from "../components/GameNoteList.vue";
import GameBanner from "@/components/GameBanner.vue";
import { useGameStore } from "@/stores/GameStore";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
export default {
    setup(params) {
        const gameStore = useGameStore();
        const route = useRoute();
        const router = useRouter();


        const currentTab = ref('Characters');

        const tabs = {
            Notes,
            Characters
        }

        return {
            gameStore,
            route,
            router,
            currentTab,
            tabs

        }
    },
    created() {
        this.gameStore.fetchGameNotations(this.route.params.game);
        this.gameStore.fetchDirectionalInputs();
        this.gameStore.fetchTags(this.route.params.game);
    },
    components: {
        Notes,
        Characters,
        GameBanner
    }
}
</script>
<template lang="">
    <div class="flex flex-col items-center">
        <!-- <h3>{{ gameStore.game.title }}</h3> -->
        <GameBanner class="h-1/2 w-1/2" :game="gameStore.game.abbreviation" />
        <nav>
            <ul class="flex flex-row font-bold space-x-4 text-2xl justify-center">
                <li 
                    v-for="(_, tab) in tabs" 
                    :key="tab"
                    :class="{ 'border-b-2 border-b-blue': currentTab === tab }"
                    @click="currentTab = tab"
                >
                    <!-- <span v-if="tab === 'CharacterMoveList'">Moves</span>
                    <span v-if="tab === 'CharacterComboList'">Combos</span> -->
                        {{ tab }}
                        <!-- {{_}} -->
                </li>
            </ul>
        </nav>
        <component :is="tabs[currentTab]"></component>
        <!-- <h1 class="font-bold text-3xl">Characters</h1>
        <div class="flex flex-row w-full">
            <CharacterList class="overflow-y-auto" />
        </div> -->
    </div>
</template>
<style lang="">
    
</style>