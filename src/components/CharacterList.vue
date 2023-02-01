<script lang="ts">
    import { useCharacterStore } from '../stores/CharacterStore';
    import { useRouter, useRoute } from 'vue-router';
    export default {
        setup(params) {
            const characterStore = useCharacterStore();
            const router = useRouter();
            const route = useRoute();

            const goToCreateCharacterCombo = (gameId: string, characterId: string) => {
                characterStore.setCharacter(characterId);
                router.push(`/combo-viewer/${gameId}/characters/${characterId}`);
            }
            return {
                characterStore,
                router,
                route,
                goToCreateCharacterCombo
            }
        },
        created() {
            console.log(typeof this.route.params.game)
            this.characterStore.fetchCharacters(this.route.params.game)
            .catch(error => {
                console.log(error);
            })
        }
    }
</script>
<template lang="">
    <div>
        <p>Character List</p>
        <ul>
            <li
                v-for="character in characterStore.characters"
                :key="character.id"
                @click="goToCreateCharacterCombo(character.game_id, character.id)"
            >{{ character.name }}</li>
        </ul>
    </div>
</template>
<style lang="">
    
</style>