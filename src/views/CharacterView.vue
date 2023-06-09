<script lang="ts">
import { useCharacterStore } from '@/stores/CharacterStore';
import { useComboStore } from '@/stores/ComboStore';
import Notes from '@/components/CharacterNoteList.vue';
import Moves from '@/components/CharacterMoveList.vue';
import Combos from '@/components/CharacterComboList.vue';
import { useCharacterMoveStore } from '@/stores/CharacterMoveStore';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
    setup(params) {
        const characterStore = useCharacterStore();
        const characterMoveStore = useCharacterMoveStore();
        const comboStore = useComboStore();
        const route = useRoute();
        const router = useRouter();

        const currentTab = ref('Moves');

        const tabs = {
            Notes,
            Moves,
            Combos,
        }


        return {
            characterStore,
            characterMoveStore,
            comboStore,
            route,
            router,
            currentTab,
            tabs,
        }
    },
    created() {
        this.characterMoveStore.fetchCharacterMoves(this.route.params.game, this.route.params.character);
        this.comboStore.fetchCharacterCombos(this.route.params.game, this.route.params.character);
    },
    // components: {
    //     CharacterMoveList
    // }
}
</script>
<template lang="">
    <div class="mt-8">
        <div class="flex flex-row justify-center mb-4">
            <h3 class="text-3xl font-bold">{{ characterStore.character.name }}</h3>
        </div>
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
      <!-- <CharacterMoveList /> -->
    </div>
</template>
<style lang="">
    
</style>