<script lang="ts">
export default {
    props: {
        characterName: String,
        characterProfileImgLink: String
    }
}
</script>
<template lang="">
    <div class="border rounded p-2 flex flex-col w-full">
        <div></div>
        <div>
            <p>{{ characterName }}</p>
        </div>
    </div>
</template>
<style lang="">
    
</style>