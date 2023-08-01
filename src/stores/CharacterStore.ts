import { defineStore } from 'pinia';
import { useAuthStore } from './AuthStore';
import trainingModeApi from '../axios-http';

export const useCharacterStore = defineStore('CharacterStore', {
    state: () => ({
        characters: [],
        character: {},

        characterListDisplay: [],

        characterNotes: [],
        characterNoteListDisplay: [],
        characterNoteSearchInputValue: '',

        characterSearchInputValue: '',

        characterNotations: [],
    }),
    getters: {
        getCharacter(state) {
            return state.character;
        },
        // getCharacterName(state) {
        //     return state.character.name;
        // }
    },
    actions: {
        async fetchCharacters(gameId: any) {
            const authStore = useAuthStore();
            const endpoint = authStore.loggedInUser === null ? `/games/${gameId}/characters/guest` : `/games/${gameId}/characters`;

            try {
                const data = await trainingModeApi.get(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                this.characters = data.data;
                this.characterListDisplay = data.data;
            }
            catch(error) {
                console.log(error);
            }
        },
        async setCharacter(characterId: string) {
            const authStore = useAuthStore();

            this.character = this.characters.find(character => character.id == characterId);
            if(authStore.loggedInUser !== null) {
                this.fetchCharacterNotes(characterId);
                this.characterNoteListDisplay = [...this.character.notes];
            }
            this.characterNotations = this.character.notations;
            this.characterSearchInputValue = '';
            localStorage.setItem('character', `${this.character.name}`);
            localStorage.setItem('characterId', `${this.character.id}`);
        },
        async fetchCharacterNotes(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeApi.get(`/games/${gameId}/characters/${characterId}/notes`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.characterNotes = [...response.data]
                    this.updateCharacterNoteListDisplay();
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterSearchCriteria(input: string) {
            this.characterSearchInputValue = input;
        },
        async updateCharacterNoteSearchCriteria(input: string) {
            // console.log('inside updateCharacterNoteSearchCriteria');
            this.characterNoteSearchInputValue = input;
        },

        async updateCharacterListDisplay() {
            if(this.characterSearchInputValue.length === 0) {
                this.characterListDisplay = [...this.characters];
            } else {
                this.characterListDisplay = this.characters.filter(character => character.name.toLowerCase().includes(this.characterSearchInputValue.toLowerCase()))
            }
        },
        async updateCharacterNoteListDisplay() {
            // console.log('inside updateCharacterNoteListDisplay');
            if(this.characterNoteSearchInputValue.length === 0) {
                this.characterNoteListDisplay = [...this.characterNotes];
                console.log(this.characterNoteListDisplay);
            } else {
                // TODO This would be where we make the change from searching by 'title' to either 'body', 'both'
                // TODO or for when we remove note titles completely if we do so.
                this.characterNoteListDisplay = this.characterNotes.filter(characterNote => characterNote.title.toLowerCase().includes(this.characterNoteSearchInputValue.toLowerCase()))
            }
        },
        async saveCharacterNote(gameId: string, characterId: string, note: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeApi.post(`/games/${gameId}/characters/${characterId}/notes`, {
                    'title': note.title,
                    'body': note.body
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authStore.token}`
                        }
                    })
                .then(response => {
                    this.fetchCharacterNotes(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterNote(gameId: string, characterId: string, note: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeApi.put(`games/${gameId}/characters/${characterId}/notes/${note.id}`, {
                    'title': note.title,
                    'body': note.body
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterNotes(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCharacterNote(gameId: string, characterId: string, noteId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeApi.delete(`/games/${gameId}/characters/${characterId}/notes/${noteId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterNotes(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        }
        
    }
})