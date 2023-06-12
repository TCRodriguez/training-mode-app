<script lang="ts">
import GameList from "../components/GameList.vue";
export default {
    components: {
        GameList,
    }
}
</script>
<template lang="">
    <div class="flex flex-col items-center mt-4">
        <h1 class="font-bold text-3xl mb-8">Select Game</h1>
        <GameList></GameList>
    </div>
</template>
<style lang="">
    
</style>