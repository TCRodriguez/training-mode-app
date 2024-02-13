<script lang="ts">
    import { useCharacterStore } from '../stores/CharacterStore';
    import { useGameStore } from '@/stores/GameStore';
    import { useNavigationStore } from '@/stores/NavigationStore';
    import { useRouter, useRoute } from 'vue-router';
    import { ref, computed, watch } from 'vue';
    import CharacterCard from './CharacterCard.vue';
    import MagnifyingGlass from './icons/MagnifyingGlass.vue';
    import SearchBar from './SearchBar.vue';
    import { getGameId } from '@/common/helpers';
    export default {
        setup(params) {
            const characterStore = useCharacterStore();
            const gameStore = useGameStore();
            const navigationStore = useNavigationStore();
            const router = useRouter();
            const route = useRoute();

            const game = gameStore.game.abbreviation === undefined ? localStorage.getItem('game') : gameStore.game.abbreviation;
            const loadCharacterData = (characterId: string) => {
                const gameId = getGameId();
                
                characterStore.setCharacter(characterId);
                characterSearchInput.value = '';

                const navItem = {
                    name: characterStore.getCharacterName,
                    link: `/games/${gameId}/characters/${characterId}`,
                    type: 'character'
                };
                router.push(navItem.link);

                // navigationStore.addNavigationItem(navItem);

                localStorage.setItem('characterId', characterId);
            }
            const characterListLoading = computed({
                get: () => characterStore.characterListLoading,
                set: (value) => characterStore.characterListLoading = value
            });

            const searchCharacterInputValue = computed(() => characterStore.characterSearchInputValue);
            const characterSearchInput = ref('');
            const updateCharacterSearchInput = (searchValue: string) => {
                characterSearchInput.value = searchValue;
            }
            let inputHasFocusBool = ref(false);
            const showCharacterList = () => {
                inputHasFocusBool.value = !inputHasFocusBool.value
            }
            const hideCharacterList = () => {
                inputHasFocusBool.value = !inputHasFocusBool.value
            }

            watch(characterSearchInput, () => {
                characterStore.updateCharacterSearchCriteria(characterSearchInput.value)
                    .then(() => {
                        characterStore.updateCharacterListDisplay();
                    })
            })
            return {
                characterStore,
                gameStore,
                navigationStore,
                router,
                route,
                game,
                loadCharacterData,
                searchCharacterInputValue,
                characterSearchInput,
                inputHasFocusBool,
                showCharacterList,
                hideCharacterList,
                updateCharacterSearchInput,
                characterListLoading
            }
        },
        components: {
            CharacterCard,
            MagnifyingGlass,
            SearchBar
        }
    }
</script>
<template lang="">
    <div class="w-full p-2 lg:px-80">
        <div class="flex flex-row items-center justify-center">
                <SearchBar 
                    placeholder="Enter character name" 
                    :searchType="'title'" 
                    @trigger-update-search-input="updateCharacterSearchInput"
                    class="placeholder:text-black"
                />
        </div>
        <div class="h-[20rem] xs:h-[20rem] lg:h-[23rem] overflow-y-auto">
            <ul class="space-y-4">
                <li
                    v-for="character in characterStore.getAlphabeticalCharacterListDisplay"
                    :key="character.id"
                >
                    <div v-if="characterListLoading" class="skeleton-loading rounded h-[7rem] lg:w-4/6 flex w-full self-center"></div>
                    <CharacterCard 
                        :game="game" 
                        :characterName="character.name" 
                        class="font-bold text-xl"
                        @trigger-load-character-data="loadCharacterData(character.id)"
                    />     
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
    input::placeholder {
        @apply text-black;
    }
</style>