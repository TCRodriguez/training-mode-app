<script lang="ts">
export default {
    props: {
        bannerImg: String
    }
}
</script>
<template>
    <div>
        <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/banners/${bannerImg}-banner.png`" alt="" srcset="">
    </div>
</template>
<style lang="">
    
</style>