<script lang="ts">
import GameList from "../components/GameList.vue";
import MagnifyingGlass from "@/components/icons/MagnifyingGlass.vue";
export default {
    components: {
        GameList,
        MagnifyingGlass
    }
}
</script>
<template lang="">
    <div class="flex flex-col items-center pt-16">
        <h1 class="font-bold text-3xl">Select Game</h1>
        <div class="flex flex-row w-full">
            <MagnifyingGlass />
            <input 
                class="
                    bg-gray 
                    border 
                    rounded 
                    p-2 
                    placeholder:text-black 
                    placeholder:font-bold 
                    placeholder:text-lg
                    placeholder:opacity-50
                    w-full
                    my-2
                "
                type="text" 
                placeholder="Search Games"
            >
        </div>
        <GameList></GameList>
    </div>
</template>
<style lang="">
    
</style>