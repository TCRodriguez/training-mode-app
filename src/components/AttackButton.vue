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
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/attack-buttons%2F${iconFileName}`" 
        alt=""
        class="h-12 w-12"
        
    >
</template>
<style lang="">
    
</style>