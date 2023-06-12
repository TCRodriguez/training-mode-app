<script lang="ts">

export default {
    props: {
        iconFileName: String,
        game: String
    }
}
</script>
<template lang="">
    <img
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${game}%2F${iconFileName}`" 
        alt=""
    >
</template>
<style lang="">
    
</style>