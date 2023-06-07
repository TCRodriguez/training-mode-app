<script lang="ts">
import CharacterList from "../components/CharacterList.vue";
import { useGameStore } from "@/stores/GameStore";
import { useRoute, useRouter } from "vue-router";
export default {
    setup(params) {
        const gameStore = useGameStore();
        const route = useRoute();
        const router = useRouter();

        return {
            gameStore,
            route,
            router

        }
    },
    created() {
        this.gameStore.fetchGameNotations(this.route.params.game);
        this.gameStore.fetchDirectionalInputs();
        this.gameStore.fetchAttackButtons(this.route.params.game);
        this.gameStore.fetchTags(this.route.params.game);
    },
    components: {
        CharacterList
    }
}
</script>
<template lang="">
    <div class="flex flex-col items-center mt-16">
        <h1 class="font-bold text-3xl">Select Character</h1>
        <div class="flex flex-row w-full">
            <CharacterList class="overflow-y-auto" />
        </div>
    </div>
</template>
<style lang="">
    
</style>