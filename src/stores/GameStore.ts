import { defineStore } from 'pinia';
import trainingModeAPI from '../axios-http';

export const useGameStore = defineStore('GameStore', {
    state: () => ({
        games: [],
        game: {},
        notations: [],
        attackButtons: [],
        directionalInputs: []

    }),
    getters: {
        getGames(state){
            return state.games
        }
    },
    actions: {
        async fetchDirectionalInputs() {
            try {
                const data = await trainingModeAPI.get('/directional-inputs');
                this.directionalInputs = data.data;
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchGames() {
            try {
                const data = await trainingModeAPI.get('/games')
                console.log(data);
                this.games = data.data;
            }
            catch(error) {
                console.log(error);
            }
        },
        async fetchAttackButtons(gameId: string) {
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/attack-buttons`)
                this.attackButtons = data.data
                console.log(data.data);
            } catch(error) {
                console.log(error);
            }
        },
        async setGame(gameId: string) {
            this.game = this.games.find(game => game.id === gameId);
        }
    }
});