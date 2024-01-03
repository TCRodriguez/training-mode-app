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

            const searchCharacterInputValue = computed(() => characterStore.characterSearchInputValue);
            const characterSearchInput = ref('');
            const updateCharacterSearchInput = (searchValue: string) => {
                characterSearchInput.value = searchValue;
            }
            let inputHasFocusBool = ref(false);
            const showCharacterList = () => {
                inputHasFocusBool.value = !inputHasFocusBool.value
                console.log(inputHasFocusBool.value);
            }
            const hideCharacterList = () => {
                inputHasFocusBool.value = !inputHasFocusBool.value
                console.log(inputHasFocusBool.value);
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
                updateCharacterSearchInput
            }
        },
        created() {
            this.characterStore.fetchCharacters(this.route.params.game)
            .catch(error => {
                console.log(error);
            })
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
                    :placeholder="'Enter character name'" 
                    :searchType="'title'" 
                    @trigger-update-search-input="updateCharacterSearchInput" 
                />
        </div>
        <div class="xs:h-[27.5rem] lg:h-[23rem] overflow-y-auto">
            <ul class="space-y-4">
                <li
                    v-for="character in characterStore.characterListDisplay"
                    :key="character.id"
                    @mousedown="loadCharacterData(character.id)"
                >
                    <CharacterCard :game="game" :characterName="character.name" class="font-bold text-xl"/>     
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