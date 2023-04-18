<script lang="ts">
    import { useGameStore } from '../stores/GameStore';
    import { useRouter } from 'vue-router';
    import GameBanner from './GameBanner.vue';
    export default {
        setup() {
            const gameStore = useGameStore();
            const router = useRouter();
            const goToCharacterSelect = (gameId: string) => {
                gameStore.setGame(gameId);
                router.push(`/combo-viewer/${gameId}/create-combo`)
            }

            return {
                gameStore,
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
            GameBanner
        }
    }
</script>

<template lang="">
    <div>
        <!-- <p>Game List</p> -->
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