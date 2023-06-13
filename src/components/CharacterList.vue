<script lang="ts">
    import { useCharacterStore } from '../stores/CharacterStore';
    import { useGameStore } from '@/stores/GameStore';
    import { useNavigationStore } from '@/stores/NavigationStore';
    import { useRouter, useRoute } from 'vue-router';
    import { ref, computed, watch } from 'vue';
    import CharacterCard from './CharacterCard.vue';
    import MagnifyingGlass from './icons/MagnifyingGlass.vue';
    export default {
        setup(params) {
            const characterStore = useCharacterStore();
            const gameStore = useGameStore();
            const navigationStore = useNavigationStore();
            const router = useRouter();
            const route = useRoute();

            const loadCharacterData = (characterId: string) => {
                const game = gameStore.getGame;
                
                characterStore.setCharacter(characterId);
                characterSearchInput.value = '';

                const navItem = {
                    name: characterStore.getCharacterName,
                    link: `/games/${game?.id}/characters/${characterId}`,
                    type: 'character'
                };
                router.push(navItem.link);

                navigationStore.addNavigationItem(navItem);
            }

            const searchCharacterInputValue = computed(() => characterStore.characterSearchInputValue);
            const characterSearchInput = ref('');
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
                loadCharacterData,
                searchCharacterInputValue,
                characterSearchInput,
                inputHasFocusBool,
                showCharacterList,
                hideCharacterList
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
            MagnifyingGlass
        }
    }
</script>
<template lang="">
    <div class="w-full p-2">
        <div class="flex flex-row items-center justify-center">
            <div class="flex flex-row xs:w-full items-center lg:w-1/3">
                <MagnifyingGlass class="h-10 w-10" />
                <input 
                    type="text" 
                    placeholder="Enter character name" 
                    v-model="characterSearchInput" 
                    class="my-8"
                >
            </div>
        </div>
        <div class="xs:h-[20rem] lg:h-[23rem] overflow-y-auto">
            <ul class="space-y-2 divide-y-2">
                <li
                    v-for="character in characterStore.characterListDisplay"
                    :key="character.id"
                    @mousedown="loadCharacterData(character.id)"
                >
                    <CharacterCard :game="gameStore.game.abbreviation" :characterName="character.name" class="font-bold text-xl"/>     
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="">
    
</style>