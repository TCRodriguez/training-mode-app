<script lang="ts">
import GameList from "../components/GameList.vue";
export default {
    components: {
        GameList,
    }
}
</script>
<template lang="">
    <div class="flex flex-col items-center mt-16">
        <h1 class="font-bold text-3xl">Select Game</h1>
        <GameList></GameList>
    </div>
</template>
<style lang="">
    
</style>