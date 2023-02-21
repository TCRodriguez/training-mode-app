<script lang="ts">
    import { useGameStore } from '../stores/GameStore';
    import { useRouter } from 'vue-router';
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
        }
    }
</script>

<template lang="">
    <div>
        <p>Game List</p>
        <ul>
            <li 
                v-for="game in gameStore.games"
                :key="game.id"
                @click="goToCharacterSelect(game.id)"
            >{{ game.title }}</li>
        </ul>
    </div>
</template>

<style lang="">
    
</style>