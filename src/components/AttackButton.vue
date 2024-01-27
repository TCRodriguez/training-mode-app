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
    <button>
        <img
            :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/attack-buttons%2F${game}%2F${game}-${attack.game_shorthand.replace(/\s/g, '')}.svg`" 
            alt=""
        >
    </button>
</template>
<style lang="">
    
</style>