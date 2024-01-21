<script lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import NavBar from './components/NavBar.vue';
import { useAuthStore } from "./stores/AuthStore";
import { useGameStore } from "./stores/GameStore";
import { useCharacterStore } from "./stores/CharacterStore";
import { getCharacterId, getGameId, closeMenu } from "./common/helpers";
import { watch, onMounted, onUnmounted } from "vue";
import { showToast } from "./common/helpers";
import { toast, type ToastOptions } from 'vue3-toastify';
import { useNavigationStore } from "./stores/NavigationStore";

export default {
  setup() {
    const authStore = useAuthStore();
    const gameStore = useGameStore();
    const characterStore = useCharacterStore();
    const navigationStore = useNavigationStore();
    const route = useRoute();
    const router = useRouter();

    const handleClickOutsideMenuModal = (event: any) => {
      if (event.target.id === 'menu-overlay') {
        closeMenu();
      }
    }

    onMounted(() => {
      window.addEventListener('click', handleClickOutsideMenuModal);
    });

    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutsideMenuModal);
    });
  
    watch(route, (to, from) => {
      // Check for `status` and `message` query parameters
      if (to.query.status && to.query.message) {
        if (to.query.status === 'success' && to.query.message === 'Email successfully verified.') {
          toast.success("Email verification successful! You may now log in.", {
            autoClose: 5000,
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              return router.replace({ path: to.path, query: {} });
            }
          } as ToastOptions);
          navigationStore.openMenuModalContainer();
          authStore.openLoginForm();
        } else if (to.query.status === 'failed') {
          showToast('There was a problem with the email verification.', 5000, 'error');
        }
      }
    });

    return {
      gameStore,
      characterStore,
      getGameId
    }
  },
  components: {
    NavBar,
    RouterView
  },
  created() {
    const gameId = getGameId();
    const characterId = getCharacterId();

    this.gameStore.fetchGames()
    .then(() => {
      this.gameStore.setGame(gameId);
    })
    this.gameStore.fetchDirectionalInputs();
    this.gameStore.fetchAttackButtons(gameId);
    this.gameStore.fetchGameNotations(gameId);
    this.characterStore.fetchCharacters(gameId)
    .then(() => {
      this.characterStore.setCharacter(characterId);
    });
  }
}
</script>

<template>
    <main class="flex justify-center">
      <div id="main" class="bg-apex-blue text-white w-full xs:h-screen relative">
        <div id="#overlay" class="absolute z-0 bg-apex-blue w-full h-full opacity-[.98]"></div>
        <div class="z-50 absolute">
          <NavBar></NavBar>
          <RouterView />
        </div>
      </div>
    </main>
</template>

<style scoped>
#main {
  background-image: url('@/assets/art_bg_001.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
