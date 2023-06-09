<script lang="ts">
export default {
    setup() {





        return {

        }
    },
    props: {
        note: Object
    }
}
</script>
<template lang="">
    <div>
        <h3 class="font-bold text-lg">{{note.title}}</h3>
        <p>{{note.body}}</p>
    </div>
</template>
<style lang="">
    
</style>