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
    <div>
        <!-- <p>Game List</p> -->
        <div class="flex flex-row w-full items-center">
            <MagnifyingGlass class="h-10 w-10" />
            <input 
                class="my-8"
                type="text" 
                placeholder="Search Games"
            >
        </div>
        <ul>
            <li 
                v-for="game in gameStore.games"
                :key="game.id"
                @click="goToCharacterSelect(game.id)"
            >
                <!-- {{ game.title }} -->
                <!-- <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/banners/${game.title}-banner.png`" alt="" srcset=""> -->
                <GameBanner class="" :bannerImg="`${game.title}`"/>
            </li>
            <!-- <li>
                <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/banners/${gameStore.game.title}-banner.png`" alt="" srcset="">
            </li> -->
        </ul>
    </div>
</template>

<style lang="">
    
</style>