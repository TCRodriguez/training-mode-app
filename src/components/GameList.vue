<script lang="ts">
    import { useGameStore } from '../stores/GameStore';
    import { useNavigationStore } from '@/stores/NavigationStore';
    import { useRouter } from 'vue-router';
    import GameBanner from './GameBanner.vue';
    import MagnifyingGlass from './icons/MagnifyingGlass.vue';
    export default {
        setup() {
            const gameStore = useGameStore();
            const navigationStore = useNavigationStore();
            const router = useRouter();
            const goToCharacterSelect = (gameId: string) => {
                gameStore.setGame(gameId);

                const navItem = {
                    name: gameStore.getGameTitle,
                    link: `/games/${gameId}/characters`,
                    type: 'game'
                };
                // router.push(`/games/${gameId}/create-combo`)
                router.push(navItem.link)

                navigationStore.addNavigationItem(navItem)
            }

            return {
                gameStore,
                navigationStore,
                router,
                goToCharacterSelect
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
            MagnifyingGlass
        }
    }
</script>

<template lang="">
    <div class="flex flex-col">
        <!-- <p>Game List</p> -->
        <div class="flex flex-row w-full items-center">
            <MagnifyingGlass class="h-10 w-10" />
            <input 
                class="my-8"
                type="text" 
                placeholder="Search Games"
            >
        </div>
        <div class="h-full overflow-scroll">
            <ul class="space-y-4 xs:h-96 lg:h-[32rem]">
                <li 
                    v-for="game in gameStore.games"
                    :key="game.id"
                    @click="goToCharacterSelect(game.id)"
                >
                    <!-- {{ game.title }} -->
                    <!-- <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/banners/${game.title}-banner.png`" alt="" srcset=""> -->
                    <div class="relative">
                        <div class="absolute w-full h-full flex justify-center items-center font-bold sm:text-5xl lg:text-5xl z-10">
                            <p v-if="gameStore.comingSoonList.includes(game.title)" class="">Support coming soon...</p>
                        </div>
                        <GameBanner :class="{ 'opacity-25': gameStore.comingSoonList.includes(game.title)}" :game="`${game.abbreviation}`"/>
                    </div>
                </li>
                <!-- <li>
                    <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/banners/${gameStore.game.title}-banner.png`" alt="" srcset="">
                </li> -->
            </ul>
        </div>
    </div>
</template>

<style lang="">
    
</style>