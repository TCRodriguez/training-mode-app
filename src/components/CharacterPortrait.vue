
<script lang="ts">
export default {
    props: {
        game: String,
        characterName: String,
    },
}
</script>
<template lang="">
    <div>
        <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/character-art%2F${game}%2F${game}-${characterName}.png`" alt="" srcset=""> 
    </div>
</template>
<style lang="">
    
</style>