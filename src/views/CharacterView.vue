<script lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useGameStore } from '@/stores/GameStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useComboStore } from '@/stores/ComboStore';
import Notes from '@/components/NoteList.vue';
import Moves from '@/components/CharacterMoveList.vue';
import Combos from '@/components/CharacterComboList.vue';
import CharacterPortrait from '@/components/CharacterPortrait.vue';
import CharacterHeroImage from '@/components/CharacterHeroImage.vue';
import { useCharacterMoveStore } from '@/stores/CharacterMoveStore';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCharacterName, getGameAbbreviation, getGameId, getCharacterId } from '@/common/helpers';
export default {
    setup(params) {
        const authStore = useAuthStore();
        const gameStore = useGameStore();
        const characterStore = useCharacterStore();
        const characterMoveStore = useCharacterMoveStore();
        const comboStore = useComboStore();
        const route = useRoute();
        const router = useRouter();

        const currentTab = ref('Moves');
        
        if(localStorage.getItem('currentCharacterViewPageTab') === undefined || localStorage.getItem('currentCharacterViewPageTab') === null ){
            currentTab.value = 'Moves';
        } else {
            currentTab.value = localStorage.getItem('currentCharacterViewPageTab');
        }

        const handleTabClick = (tab: string) => {
            localStorage.setItem('currentCharacterViewPageTab', tab);
            currentTab.value = tab;

        }

        const tabs = {
            Moves,
            Combos,
            Notes,
        };

        const componentProps = {
            modelId: getCharacterId(),
            modelName: 'character',
            showAddIcon: true
        }

        return {
            authStore,
            gameStore,
            characterStore,
            characterMoveStore,
            comboStore,
            route,
            router,
            currentTab,
            tabs,
            getCharacterName,
            getGameAbbreviation,
            componentProps,
            handleTabClick
        }
    },
    created() {
        this.characterMoveStore.fetchCharacterMoves(this.route.params.game, this.route.params.character);
        if(this.authStore.loggedInUser !== null){
            this.comboStore.fetchCharacterCombos(this.route.params.game, this.route.params.character);
            this.characterStore.fetchCharacterNotes(getGameId(), getCharacterId());
        }
    },
    components: {
        CharacterPortrait,
        CharacterHeroImage
    },
}
</script>
<template lang="">
    <div class="">
        <CharacterHeroImage
            :game="getGameAbbreviation()"
            :characterName="getCharacterName()"
        />
        <nav>
            <ul class="flex flex-row font-bold space-x-4 text-2xl justify-center">
                <li 
                    v-for="(_, tab) in tabs" 
                    :key="tab"
                    :class="{ 'border-b-2 border-b-apex-yellow': currentTab === tab }"
                    @click="currentTab = tab, handleTabClick(tab)"
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