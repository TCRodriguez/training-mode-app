<script lang="ts">





export default {
    setup(props) {
        let directionalInputFileName;

        if (props.game === 'gbvsr' && props.direction.game_shorthand === 'uh') {
            directionalInputFileName = 'uph';
        } else {
            directionalInputFileName = props.direction.game_shorthand;
        }


        return {
            directionalInputFileName
        }
        
    },
    props: {
        iconFileName: String,
        direction: {
            type: Object,
            default: () => ({})
        },
        game: String
    }
}
</script>
<template lang="">
    <!-- <img
        :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${game}%2F${iconFileName}`" 
        alt=""
    > -->
    <button class="cursor-default">
        <img
            :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${game}%2F${game}-${directionalInputFileName }.svg`" 
            :alt="direction.direction"
        >
    </button>
</template>
<style lang="">
    
</style>