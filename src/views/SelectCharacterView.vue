<script lang="ts">
import Characters from "../components/CharacterList.vue";
import Notes from '@/components/NoteList.vue';
import GameBanner from "@/components/GameBanner.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useGameStore } from "@/stores/GameStore";
import { useRoute, useRouter } from "vue-router";
import { getCharacterName, getGameAbbreviation, getGameId, getCharacterId } from '@/common/helpers';
import { ref } from "vue";
export default {
    setup(params) {
        const authStore = useAuthStore();
        const gameStore = useGameStore();
        const route = useRoute();
        const router = useRouter();

        const currentTab = ref('Characters');

        const tabs = {
            Notes,
            Characters
        }

        const componentProps = {
            modelId: getGameId(),
            modelName: 'game',
            showAddIcon: true
        }
        
        return {
            authStore,
            gameStore,
            route,
            router,
            currentTab,
            tabs,
            getGameAbbreviation,
            componentProps,
            getGameId
        }
    },
    created() {
        this.gameStore.fetchGameNotations(this.route.params.game);
        this.gameStore.fetchAttackButtons(this.route.params.game)
        this.gameStore.fetchDirectionalInputs();
        this.gameStore.fetchTags(this.route.params.game);
        if(this.authStore.loggedInUser !== null){
            this.gameStore.fetchGameNotes(getGameId());
        }
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
        <GameBanner class="h-1/2 w-1/2" :game="getGameAbbreviation()" />
        <nav>
            <ul class="flex flex-row font-bold space-x-4 text-2xl justify-center">
                <li 
                    v-for="(_, tab) in tabs" 
                    :key="tab"
                    :class="{ 'border-b-2 border-b-blue': currentTab === tab }"
                    @click="currentTab = tab"
                >
                    {{ tab }}
                </li>
            </ul>
        </nav>
        <component :is="tabs[currentTab]" v-bind="componentProps"></component>
    </div>
</template>
<style lang="">
    
</style>