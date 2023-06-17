import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('NavigationStore', {
    state: () => ({
        navItems: [],
        dashboardItems: [
            {
                name: 'Game Data',
                icon: 'GameControllerIcon',
                link: '/games'
            },
        ]
    }),
    getters: {

    },
    actions: {
        async addNavigationItem(navItem: { name: string; link: string; type: string; }) {
            this.navItems.push(navItem);
        },
        async clearNavItems() {
            this.navItems = [];
        },
        async popCharacterNavItem() {
            this.navItems.pop();
            console.log(this.navItems);
        }
    }
});