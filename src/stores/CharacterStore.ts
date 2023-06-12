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
        getCharacterName(state) {
            return state.character.name;
        }
    },
    actions: {
        async fetchCharacters(gameId: any) {
            const authStore = useAuthStore();
            try {
                const data = await trainingModeApi.get(`/games/${gameId}/characters`, {
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
        async setCharacter(characterId: any) {
            this.character = this.characters.find(character => character.id === characterId);
            this.character.bread_crumb_type = 'character';
            this.characterNoteListDisplay = [...this.character.notes];
            this.characterNotations = this.character.notations;
            this.characterSearchInputValue = '';
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
                    console.log(response.data);
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
            if(this.characterNoteSearchInputValue.length === 0) {
                this.characterNoteListDisplay = [...this.characterNotes];
            } else {
                this.characterNoteListDisplay = this.character.notes.filter(characterNote => characterNote.title.toLowerCase().includes(this.characterNoteSearchInputValue.toLowerCase()))
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