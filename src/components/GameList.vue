<script lang="ts">
    import { storeToRefs } from 'pinia';
    import { useGameStore } from '../stores/GameStore';
    import { useCharacterStore } from '@/stores/CharacterStore';
    import { useNavigationStore } from '@/stores/NavigationStore';
    import { useRouter } from 'vue-router';
    import GameBanner from './GameBanner.vue';
    import MagnifyingGlass from './icons/MagnifyingGlass.vue';
    import SearchBar from './SearchBar.vue';
    export default {
        setup() {
            const gameStore = useGameStore();
            const navigationStore = useNavigationStore();
            const characterStore = useCharacterStore();
            const router = useRouter();
            const goToCharacterSelect = (gameId: string) => {
                const game = gameStore.findGame(gameId);
                if(gameStore.comingSoonList.includes(game?.title)) {
                    return;
                }
                gameStore.setGame(gameId);

                const navItem = {
                    name: gameStore.getGameTitle,
                    link: `/games/${gameId}/characters`,
                    type: 'game'
                };
                
                characterStore.fetchCharacters(gameId)
                .then(() => {
                    router.push(navItem.link)
    
                    navigationStore.addNavigationItem(navItem)
    
                    localStorage.setItem('gameId', gameId);
                })
                .catch(error => {
                    console.log(error);
                })
            }

            const updateGameSearchInput = (searchInput: string) => {
                // gameStore.setGameNoteSearchInput(searchInput);
                // TODO: Implement search functionality
            }

            return {
                gameStore,
                navigationStore,
                router,
                goToCharacterSelect,
                updateGameSearchInput
            }
        },
        created() {
            this.gameStore.fetchGames()
            .catch(error => {
                console.log(error);
            })
        },
        components: {
            GameBanner,
            MagnifyingGlass,
            SearchBar
        }
    }
</script>

<template lang="">
    <div class="flex flex-col">
        <div class="flex flex-row w-full items-center hidden">
            <MagnifyingGlass class="h-10 w-10" />
            <input 
                class="my-8"
                type="text" 
                placeholder="Search Games"
            >
            <SearchBar @trigger-update-search-input="updateGameSearchInput" />
        </div>
        <div class="h-full overflow-y-auto">
            <ul class="grid grid-cols-2 space-y-4 xs:h-96 lg:h-[45rem]">
            <!-- <ul class="flex flex-row space-y-4 xs:h-96 lg:h-[45rem]"> -->
                <li 
                    v-for="game in gameStore.getGames"
                    :key="game.id"
                    @click="goToCharacterSelect(game.id)"
                    class="flex flex-col justify-center"
                >
                    <div class="flex flex-col items-center">
                        <GameBanner class="flex justify-center lg:w-4/6" :class="{ 'opacity-25': gameStore.comingSoonList.includes(game.title)}" :game="`${game.abbreviation}`"/>
                        <div class="w-full h-full flex justify-center items-center font-bold sm:text-5xl lg:text-2xl z-10">
                            <p v-if="gameStore.comingSoonList.includes(game.title)" class="">Support coming soon...</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="">
    
</style>