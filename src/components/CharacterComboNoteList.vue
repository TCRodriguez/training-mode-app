
<script lang="ts" setup>


const props = defineProps({
    comboId: Number,
    comboNotes: Array
})
</script>
<template lang="">
    <div>
        <div>
            <ul>
                <li
                    v-for="characterComboNote in comboNotes" 
                    :key="characterComboNote.id"
                    class="border rounded p-2 flex flex-col"
                >
                    <div class="font-bold">
                        {{characterComboNote.title}}
                    </div>
                    <div>
                        {{characterComboNote.body}}
                    </div>
                </li>
            </ul>
        </div>    
    </div>
</template>
<style lang="">
    
</style>