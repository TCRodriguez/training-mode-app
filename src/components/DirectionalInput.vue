<script lang="ts">

export default {
    props: {
        iconFileName: String,
        direction: {
            type: Object,
            default: () => ({})
        },
        game: String
    }
}
</script>
<template lang="">
    <!-- <img
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${game}%2F${iconFileName}`" 
        alt=""
    > -->
    <img
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${game}%2F${game}-${direction.game_shorthand}.svg`" 
        :alt="direction.direction"
    >
</template>
<style lang="">
    
</style>