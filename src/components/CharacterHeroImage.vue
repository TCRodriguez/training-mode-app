<script lang="ts">
export default {
    props: {
        game: String,
        characterName: String,
    }
}
</script>
<template lang="">
    <div class="flex flex-row justify-center mb-4 h-24 lg:h-52 items-center space-x-4 bg-black overflow-hidden relative">
        <img 
            :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/character-art%2F${game}%2F${game}-${characterName}.png`" 
            alt="{{characterName}}" 
            srcset="" 
            class="absolute opacity-[.35] w-max h-auto xs:left-31 xs:-bottom-32 lg:left-[37rem] lg:-bottom-0 xs:-top-40 lg:top-[-9rem]">
        <div class="relative">
            <h3 class="text-5xl font-bold text-white">{{ characterName }}</h3>
        </div>
    </div>
</template>
<style lang="">
</style>