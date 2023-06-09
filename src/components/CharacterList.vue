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
                console.log(game);

                characterStore.setCharacter(characterId);
                console.log(characterSearchInput.value);
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
                // console.log(characterSearchInput.value);
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
    <div class="w-full">
        <div class="flex flex-row w-full items-center">
            <MagnifyingGlass class="h-10 w-10" />
            <input 
                type="text" 
                placeholder="Enter character name" 
                v-model="characterSearchInput" 
                class="my-8"
            >
        </div>
        <!-- <p v-if="Object.keys(characterStore.character).length !== 0">Input combo for: {{characterStore.character.name}}</p> -->
        <!-- <ul v-if="inputHasFocusBool === true">
            <li
                v-for="character in characterStore.characterListDisplay"
                :key="character.id"
                @mousedown="loadCharacterData(character.id)"
            >{{ character.name }}</li>
        </ul> -->
        <div class="xs:h-[16.5rem] lg:h-96 overflow-y-auto">
            <ul class="space-y-2">
                <li
                    v-for="character in characterStore.characterListDisplay"
                    :key="character.id"
                    @mousedown="loadCharacterData(character.id)"
                >
                    <CharacterCard :characterName="character.name" class="font-bold text-xl"/>     
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="">
    
</style>