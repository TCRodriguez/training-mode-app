<script lang="ts">

export default {
    props: {
        iconFileName: String,
        attack: {
            type: Object,
            default: () => ({})
        },
        game: String
    }
}
</script>
<template lang="">
    <img
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/attack-buttons%2F${game}%2F${game}-${attack.game_shorthand}.svg`" 
        alt=""
    >
</template>
<style lang="">
    
</style>