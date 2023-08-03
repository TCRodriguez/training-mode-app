<script lang="ts" setup>
import ResourceTagsList from './ResourceTagsList.vue';
const props = defineProps({
    note: Object
});
</script>
<template lang="">
    <div>
        <div>

            <h3 class="font-bold text-lg">{{note.title}}</h3>
            <p>{{note.body}}</p>
        </div>
        <!-- * Add ResourceTagsList component here -->

    </div>
</template>
<style lang="">
    
</style>