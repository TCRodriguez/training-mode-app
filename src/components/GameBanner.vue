<script lang="ts">

export default {
    props: {
        game: String
    }
}
</script>
<template>
    <div>
        <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/banners/${game}-banner.png`" alt="" srcset="">
    </div>
</template>
<style lang="">
    
</style>