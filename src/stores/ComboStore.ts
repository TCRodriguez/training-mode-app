import { defineStore } from 'pinia';
import trainingModeAPI from '../axios-http';

export const useComboStore = defineStore('ComboStore', {
    state: () => ({
        comboDisplay: []
    }),
    getters: {

    },
    actions: {
        async addComboInputToDisplay(comboInput) {
            this.comboDisplay.push(comboInput);
        },
        async eraseComboInput() {
            this.comboDisplay.pop();
        },
        async clearComboDisplay() {
            this.comboDisplay = [];
        }
    }
});