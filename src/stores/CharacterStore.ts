import { defineStore } from 'pinia';
import axios from 'axios';

export const useCharacterStore = defineStore('CharacterStore', {
    state: () => ({
        characters: [],
        character: {},

    }),
    actions: {
        async fetchCharacters(gameId: any) {
            try {
                const data = await axios.get(`http://127.0.0.1:8000/api/v1/games/${gameId}/characters`)
                this.characters = data.data;
                console.log(this.characters)

            }
            catch(error) {
                console.log(error);
            }
        },
        async setCharacter(characterId: string) {
            // this.character = character;
            console.log(this.characters)
            console.log("test")
            // this.characters.forEach(character => {
            //     if(character.id === characterId) {
            //         this.character = character
            //     }
            // })
            this.character = this.characters.find(character => character.id === characterId)
        }
        
    }
})