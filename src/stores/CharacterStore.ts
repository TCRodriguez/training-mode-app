import { defineStore } from 'pinia';
import trainingModeApi from '../axios-http';

export const useCharacterStore = defineStore('CharacterStore', {
    state: () => ({
        characters: [],
        characterListDisplay: [],
        characterNoteListDisplay: [],
        characterSearchInputValue: '',
        characterNoteSearchInputValue: '',
        character: {},
        characterNotations: []

    }),
    getters: {
        getCharacter(state) {
            return state.character;
        },
        getCharacterName(state) {
            return state.character.name;
        }
    },
    actions: {
        async fetchCharacters(gameId: any) {
            try {
                const data = await trainingModeApi.get(`/games/${gameId}/characters`)
                this.characters = data.data;
                this.characterListDisplay = data.data;
                this.updateCharacterNoteListDisplay();
                console.log(this.characters)

            }
            catch(error) {
                console.log(error);
            }
        },
        async setCharacter(characterId: any) {
            this.character = this.characters.find(character => character.id === characterId);
            this.character.bread_crumb_type = 'character';
            this.characterNoteListDisplay = [...this.character.notes];
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
        async updateCharacterNoteSearchCriteria(input: string) {
            this.characterNoteSearchInputValue = input;
            console.log(this.characterNoteSearchInputValue);
        },

        async updateCharacterListDisplay() {
            console.log(this.characterSearchInputValue);
            if(this.characterSearchInputValue.length === 0) {
                this.characterListDisplay = [...this.characters];
            } else {
                this.characterListDisplay = this.characters.filter(character => character.name.toLowerCase().includes(this.characterSearchInputValue.toLowerCase()))
            }
        },
        async updateCharacterNoteListDisplay() {
            this.setCharacter(this.character.id);
            if(this.characterNoteSearchInputValue.length === 0) {
                this.characterNoteListDisplay = [...this.character.notes];
            } else {
                this.characterNoteListDisplay = this.character.notes.filter(characterNote => characterNote.title.toLowerCase().includes(this.characterNoteSearchInputValue.toLowerCase()))

            }
        },
        async saveCharacterNote(gameId: string, characterId: string, note: object) {
            try {
                await trainingModeApi.post(`/games/${gameId}/characters/${characterId}/notes`, {
                    'title': note.title,
                    'body': note.body
                })
                .then(response => {
                    console.log(response);
                    this.fetchCharacters(gameId);
                    // this.characterNoteListDisplay = [...this.character.notes]
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterNote(gameId: string, characterId: string, note: object) {
            console.log(note);
            try {
                await trainingModeApi.put(`games/${gameId}/characters/${characterId}/notes/${note.id}`, {
                    'title': note.title,
                    'body': note.body
                })
                .then(response => {
                    console.log(response);
                    this.fetchCharacters(gameId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCharacterNote(gameId: string, characterId: string, noteId: string) {
            try {
                await trainingModeApi.delete(`/games/${gameId}/characters/${characterId}/notes/${noteId}`)
                .then(response => {
                    this.fetchCharacters(gameId);
                    console.log(response);
                })
            } catch (error) {
                console.log(error);
            }
        }
        
    }
})