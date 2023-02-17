<script lang="ts">

export default {
    props: {
        iconFileName: String
    }
}
</script>
<template lang="">
    <img
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/attack-buttons%2F${iconFileName}`" 
        alt="" 
    >
</template>
<style lang="">
    
</style>