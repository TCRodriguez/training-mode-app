<script lang="ts">
    import { useCharacterStore } from '../stores/CharacterStore';
    import { useRouter, useRoute } from 'vue-router';
    import { ref, computed, watch } from 'vue';
    export default {
        setup(params) {
            const characterStore = useCharacterStore();
            const router = useRouter();
            const route = useRoute();

            const loadCharacterData = (characterId: string) => {
                characterStore.setCharacter(characterId);
                console.log(characterSearchInput.value);
                characterSearchInput.value = '';
                
            }

            const searchCharacterInputValue = computed(() => characterStore.characterSearchInputValue);
            const characterSearchInput = ref('');
            let inputHasFocusBool = ref(false);
            const showCharacterList = () => {
                inputHasFocusBool.value = !inputHasFocusBool.value
                console.log(inputHasFocusBool.value);
            }
            const hideCharacterList = () => {
                inputHasFocusBool.value = !inputHasFocusBool.value
                console.log(inputHasFocusBool.value);
            }

            watch(characterSearchInput, () => {
                // console.log(characterSearchInput.value);
                characterStore.updateCharacterSearchCriteria(characterSearchInput.value)
                    .then(() => {
                        characterStore.updateCharacterListDisplay();
                    })

            })
            return {
                characterStore,
                router,
                route,
                loadCharacterData,
                searchCharacterInputValue,
                characterSearchInput,
                inputHasFocusBool,
                showCharacterList,
                hideCharacterList
            }
        },
        created() {
            this.characterStore.fetchCharacters(this.route.params.game)
            .catch(error => {
                console.log(error);
            })
        }
    }
</script>
<template lang="">
    <div>
        <input type="text" placeholder="Enter character name" v-model="characterSearchInput" @focus="showCharacterList()" @blur="hideCharacterList()">
        <p v-if="Object.keys(characterStore.character).length !== 0">Input combo for: {{characterStore.character.name}}</p>
        <ul v-if="inputHasFocusBool === true">
            <li
                v-for="character in characterStore.characterListDisplay"
                :key="character.id"
                @mousedown="loadCharacterData(character.id)"
            >{{ character.name }}</li>
        </ul>
    </div>
</template>
<style lang="">
    
</style>