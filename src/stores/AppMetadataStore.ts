import { defineStore } from "pinia";
import trainingModeAPI from '../axios-http';

export const useAppMetadataStore = defineStore('AppMedadataStore', {
    state: () => ({
        appVersion: '0.6.1',
        latestCommitHash: null,
    }),
    actions: {
        async getCommitHash() {
            try {
                // await trainingModeAPI.get()
            } catch (error) {
                
            }
        },
    }
})