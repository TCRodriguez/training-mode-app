<script lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import NavBar from './components/NavBar.vue';
import { useAuthStore } from "./stores/AuthStore";
import { useGameStore } from "./stores/GameStore";
import { useCharacterMoveStore } from "./stores/CharacterMoveStore";
import { useComboStore } from "./stores/ComboStore";
import { useCharacterStore } from "./stores/CharacterStore";
import { getCharacterId, getGameId, closeMenu, getCharacterMoveId, getCharacterComboId } from "./common/helpers";
import { watch, onMounted, onUnmounted } from "vue";
import { showToast } from "./common/helpers";
import { toast, type ToastOptions } from 'vue3-toastify';
import { useNavigationStore } from "./stores/NavigationStore";
import trainingModeApi from './axios-http';


export default {
  setup() {
    const authStore = useAuthStore();
    const gameStore = useGameStore();
    const characterMoveStore = useCharacterMoveStore();
    const comboStore = useComboStore();
    const characterStore = useCharacterStore();
    const navigationStore = useNavigationStore();
    const route = useRoute();
    const router = useRouter();

    const handleClickOutsideMenuModal = (event: any) => {
      if(authStore.passwordResetFormActive === true) {
        return;
      }
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
      if(to.query['password-reset-token']) {
        navigationStore.openMenuModalContainer();
        authStore.openResetPasswordForm();
        return;
      }

      if(to.query.category === 'oauth_callback') {
        authStore.handleOAuthCallback(to.query.access_token, to.query.token_type)
        .then(() => {
          toast.success("Login via Discord successful!", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              return router.replace({ query: {} });
            }
          } as ToastOptions);
        })
      }


      if (to.query.status && to.query.message) {
        if (to.query.status === 'success' && to.query.message === 'Email successfully verified.') {
          toast.success("Email verification successful! You may now log in.", {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              return router.replace({ path: to.path, query: {} });
            }
          } as ToastOptions);
          navigationStore.openMenuModalContainer();
          authStore.openLoginForm();
        } else if (to.query.status === 'failed') {
          showToast('There was a problem with the email verification. ', 5000, 'error');
        }
      } else if (to.query.error) {
        if (to.query.error?.includes('users.users_email_unique')) {
          // showToast('The email associated with your Discord is already in use. Please login with your email and password.', 5000, 'error');
          toast.error("The email associated with your Discord is already in use. Please login with your email and password.", {
            autoClose: 10000,
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              return router.replace({ query: {} });
            }
          } as ToastOptions);
        } else if(to.query.error?.includes('Discord username already in use')) {
          toast.error("The username associated with your Discord is already in use. Please login with your email and password.", {
            autoClose: 10000,
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              return router.replace({ query: {} });
            }
          } as ToastOptions);
        }
      }
    });

    return {
      authStore,
      gameStore,
      characterMoveStore,
      comboStore,
      characterStore,
      getGameId,
      getCharacterId,
      getCharacterMoveId,
      getCharacterComboId
    }
  },
  components: {
    NavBar,
    RouterView
  },
  created() {
    const gameId = getGameId();
    const characterId = getCharacterId();
    const moveId = getCharacterMoveId();
    const comboId = getCharacterComboId();

    const authToken = localStorage.getItem('authToken');
    if(authToken) {
      this.authStore.validateTokenAndFetchUser(authToken)
      .then(() => {
        this.gameStore.fetchGameNotes(gameId);
        this.characterStore.fetchCharacterNotes(gameId, characterId);
        this.characterMoveStore.fetchCharacterMoveNotes(gameId, characterId, moveId);
        this.comboStore.fetchCharacterCombos(gameId, characterId);
        this.comboStore.fetchCharacterComboNotes(gameId, characterId, comboId);
      })
    }

    this.gameStore.fetchGames(true)
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
