import { defineStore } from 'pinia';
import axios from 'axios';

export const useCharacterStore = defineStore('CharacterStore', {
    state: () => ({
        characters: [],
        characterListDisplay: [],
        characterSearchInputValue: '',
        character: {},
        characterNotations: []

    }),
    getters: {
        getCharacter(state) {
            return state.character;
        }
    },
    actions: {
        async fetchCharacters(gameId: any) {
            try {
                const data = await axios.get(`http://127.0.0.1:8000/api/v1/games/${gameId}/characters`)
                this.characters = data.data;
                this.characterListDisplay = data.data
                console.log(this.characters)

            }
            catch(error) {
                console.log(error);
            }
        },
        async setCharacter(characterId: any) {
            this.character = this.characters.find(character => character.id === characterId)
            // * Add a controller action to get notations along with character
            // ? Perhaps this is a new query that hits the /games/{game}/game-notations endpoint?
            // ? Or could this be worked into the fetchCharacters() action above?
            // ? We could do a ->with('notations') in the controller
            /**
             * ? Though could we do this with the index()? Or would this need to be handled by the
             * ? show() method? This would mean we'd need to do some reworking and it would add a new
             * ? API call...
             */
            // try {

            // } catch(error) {
            //     console.log(error);
            // }
            // this.character.notations = [

            // ]
            this.characterNotations = this.character.notations;
            console.log(this.characterNotations);
            this.characterSearchInputValue = '';
        },
        async updateCharacterSearchCriteria(input: string) {
            this.characterSearchInputValue = input;
            console.log(this.characterSearchInputValue);
        },

        async updateCharacterListDisplay() {
            console.log(this.characterSearchInputValue);
            if(this.characterSearchInputValue.length === 0) {
                this.characterListDisplay = [...this.characters];
            } else {
                this.characterListDisplay = this.characters.filter(character => character.name.toLowerCase().includes(this.characterSearchInputValue))
            }
        }
        
    }
})