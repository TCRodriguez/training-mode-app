<script lang="ts">

export default {
    props: {
        iconFileName: String
    }
}
</script>
<template lang="">
    <!-- <div>
        
    </div> -->
    <img
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${iconFileName}`" 
        alt=""
    >
</template>
<style lang="">
    
</style>