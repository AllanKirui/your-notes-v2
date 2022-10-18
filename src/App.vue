<template>
  <!-- signup/login pages -->
  <!-- <WelcomeHeader v-if="!isLoggedIn" /> -->
  <router-view name="authn" v-if="!isLoggedIn"></router-view>

  <!-- home page -->
  <the-header
    v-if="isLoggedIn"
    :clear-search="isCancelSearch"
    :is-searching="isSearching"
    :isOverlayVisible="isOverlayVisible"
    @is-searching="setSearchingStatus"
    @set-message="setSearchMessage"
    @remove-message="resetSearchingStatus"
    @reset-cancel="resetCancelProp"
    @toggle-overlay="toggleOverlay"
    @cancel-search="cancelSearch"
  ></the-header>
  <div
    :class="themeClasses"
    v-if="isLoggedIn"
    :style="{ 'font-size': globalFontSize / 16 + 'rem' }"
  >
    <!-- TODO: settings page and menu should handle theme switching -->
    <the-sidebar
      :class="isOverlayVisible ? 'sidebar-shown' : ''"
      @show-modal="showInputModal"
      @close-sidebar="hideOverlay"
    ></the-sidebar>
    <router-view
      :is-modal="isShowInputModal"
      :active-side="activeSide"
      :is-searching="isSearching"
      :search-message="searchMessage"
      @close-modal="closeInputModal"
      @show-notification="showNotification"
      @cancel-search="cancelSearch"
      @close-sidebar="hideOverlay"
    ></router-view>

    <!-- use the transition-group component to animate the notifications -->
    <div class="notification-wrapper">
      <transition-group tag="ul" name="notification">
        <li
          class="notification-item"
          v-for="(notification, index) in notificationQueue"
          :key="index"
          :style="`position: absolute; bottom: ${index * 50}px`"
        >
          <base-card :mode="cardStyle">
            <p class="message">{{ notification.message }}</p>
          </base-card>
        </li>
      </transition-group>
    </div>

    <!-- use the teleport component to render the overlay in the body tag -->
    <teleport to="body">
      <div
        :class="[isOverlayVisible ? 'active' : '', 'overlay']"
        title="Hide Options"
        @click="hideOverlay"
      ></div>
    </teleport>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

// import WelcomeHeader from "./components/nav/WelcomeHeader.vue";
import TheHeader from "./components/nav/TheHeader.vue";
import TheSidebar from "./components/ui/TheSidebar.vue";

let auth;

export default {
  name: "App",
  components: {
    // WelcomeHeader,
    TheHeader,
    TheSidebar,
  },
  data() {
    return {
      isLoggedIn: false,
      isShowInputModal: false,
      notificationQueue: [],
      newNotification: null,
      counter: 0,
      activeSide: null,
      isCancelSearch: false,
      isSearching: false,
      searchMessage: "",
      isOverlayVisible: false,
    };
  },
  computed: {
    theme() {
      return this.$store.getters.theme;
    },
    globalFontSize() {
      return this.$store.getters.globalFontSize;
    },
    cardStyle() {
      let mode = "";

      // for default theme
      if (!this.theme) {
        mode = "default-theme";
      }

      // for purplish theme
      if (this.theme === "purplish") {
        mode = "purplish-theme";
      }

      // for bluetiful theme
      if (this.theme === "bluetiful") {
        mode = "bluetiful-theme";
      }

      return mode;
    },
    themeClasses() {
      let classes = "container ";

      // for default theme
      if (!this.theme) {
        classes += "default-theme";
      }

      // for purplish theme
      if (this.theme === "purplish") {
        classes += "purplish-theme";
      }

      // for bluetiful theme
      if (this.theme === "bluetiful") {
        classes += "bluetiful-theme";
      }

      return classes;
    },
  },
  methods: {
    showInputModal(side) {
      this.isShowInputModal = true;
      this.activeSide = side;
      this.cancelSearch();
    },
    closeInputModal() {
      this.isShowInputModal = false;
    },
    showNotification(message) {
      this.newNotification = {
        id: this.counter,
        message: message,
        isHidden: false,
      };
    },
    setTextLength(text, size) {
      if (text.length <= size) return text;

      let shortText = "";
      for (let i = 0; i <= size; i++) {
        shortText += text[i];
      }
      return shortText + "...";
    },
    resetCancelProp() {
      this.isCancelSearch = false;
    },
    setSearchingStatus() {
      this.isSearching = true;

      // close the sidebar and overlay if they are visible
      if (this.isOverlayVisible) {
        this.isOverlayVisible = false;
      }
    },
    resetSearchingStatus() {
      this.isSearching = false;
    },
    setSearchMessage(msg) {
      this.searchMessage = `Searching for "${msg}"`;
    },
    toggleOverlay(status) {
      this.isOverlayVisible = status;
    },
    hideOverlay() {
      this.isOverlayVisible = false;
    },
    cancelSearch() {
      // clear search field in TheHeader
      this.isCancelSearch = true;
      this.isSearching = false;
    },
  },
  watch: {
    isLoggedIn(newValue) {
      // TODO: refine this logic - defect, causes reload to push to "/todos"
      if (newValue) {
        // push to todos route if logged in and going to "/signup" or "/login"
        if (this.$route.name === "signup" || this.$route.name === "login") {
          this.$router.push("/todos");
          return;
        }

        // don't push users who are already logged in to the todos page
        if (this.$route.name !== "todos") return;

        // Redirect users who successfully register to the todos page
        this.$router.push("/todos");
      }
    },
    $route(newRoute) {
      if (newRoute) {
        // reset props
        this.isShowInputModal = false;
        this.resetSearchingStatus();
        this.hideOverlay();

        // facilitate the user clicking on the create new todo button
        // from the settings route
        if (this.activeSide === "newTodoFromSettings") {
          this.isShowInputModal = true;
          this.activeSide = "New Todo";
        }
      }
    },
    newNotification(newValue) {
      if (!newValue) return;

      // add a new notification to the notification queue
      this.notificationQueue.unshift(newValue);
      this.counter++;

      // remove the new notification after 3.8 seconds
      setTimeout(() => {
        this.notificationQueue = this.notificationQueue.filter(
          (msg) => msg.id !== newValue.id
        );
      }, 3800);
    },
  },
  provide() {
    return {
      setTextLength: this.setTextLength,
    };
  },
  mounted() {
    // check if a user is logged in
    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        // dispatch an action to store the authenticated user's data
        this.$store.dispatch("auth/createUserProfile", user);
      } else {
        this.isLoggedIn = false;
      }
    });
  },
};
</script>


<style>
@import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;1,400&display=swap");

:root {
  /* Colors */
  --color-pantone-green: hsl(136, 100%, 33%);
  --color-dark-pastel-green: hsl(136, 100%, 38%);
  --color-cultured: hsl(0, 0%, 97%);
  --color-eerie-black: hsl(0, 0%, 10%);
  --color-traffic-grey: hsl(0, 0%, 32%);
  --color-venetian-red: hsl(349, 100%, 38%);
  --color-platinum: hsl(142, 39%, 89%);
  --color-white: hsl(0, 0%, 100%);
  --color-honeydew: hsl(116, 70%, 96%);
  --color-malachite: hsl(136, 100%, 44%);
  --color-light-green: hsl(135, 78%, 70%);
  --color-clouds: hsl(0, 0%, 94%);
  --color-congo-pink: hsl(0, 100%, 76%);
  --color-crayola: hsl(0, 100%, 67%);
  --color-graphite-black: hsl(0, 0%, 17%);

  /* start of colors for 'purplish' theme */
  --color-black-blue: hsl(266, 64%, 12%);
  --color-spanish-pink: hsl(9, 94%, 87%);
  --color-tickle-me-pink: hsl(336, 100%, 76%);
  --color-russian-violet: hsl(267, 53%, 17%);
  /* end of theme 2 colors */

  /* start of colors for 'bluetiful' theme */
  --color-steel-blue: hsl(211, 27%, 18%);
  --color-maximum-blue-green: hsl(186, 71%, 47%);
  --color-lavender-gray: hsl(210, 6%, 79%);
  --color-iron-gray: hsl(211, 11%, 37%);
  --color-midnight-blue: hsl(210, 28%, 24%);
  /* end of theme 3 colors */
}

html {
  font-size: 100%;
  font-family: "Rubik", sans-serif;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--color-cultured);
  overflow: hidden;
}

h1,
h2,
h3,
h4,
p {
  margin: 0;
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Flex box styles */
.flex {
  display: flex;
}

.flex-fd-c {
  flex-direction: column;
}

.flex-jc-c {
  justify-content: center;
}

.flex-jc-sb {
  justify-content: space-between;
}

.flex-ai-c {
  align-items: center;
}

.flex-ai-fe {
  align-items: flex-end;
}

.flex-fw-w {
  flex-wrap: wrap;
}

.btn {
  padding: 0.375rem 0.5rem;
  background: transparent;
  border: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  transition: all 0.15s ease-in-out;
}

/* overlay styles */
@media (max-width: 768px) {
  .overlay.active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
    cursor: pointer;
    z-index: 1;
  }

  .default-theme .overlay.active {
    background-color: rgba(26, 26, 26, 0.8);
  }

  .bluetiful-theme .overlay.active,
  .purplish-theme .overlay.active {
    background-color: rgba(28, 11, 50, 0.8);
  }
}

/* themes */
.default-theme {
  color: var(--color-eerie-black);
}

.purplish-theme {
  color: var(--color-spanish-pink);
}

.bluetiful-theme {
  color: var(--color-lavender-gray);
}

/* scrollbar styles */
::-webkit-scrollbar {
  width: 0.7em;
}

::-webkit-scrollbar-track {
  margin-block: 0.625rem;
  background: transparent;
  border-radius: 100vw;
}

::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 100vw;
}

.default-theme
  .content-wrapper
  .content-items-details
  .details-wrapper:hover::-webkit-scrollbar-track,
.default-theme .content-wrapper .content-items:hover::-webkit-scrollbar-track,
.default-theme
  .content-wrapper
  .content-items-details
  .todo-creator-wrapper
  .field:focus::-webkit-scrollbar-track {
  background: var(--color-white);
}

.purplish-theme
  .content-wrapper
  .content-items-details
  .details-wrapper:hover::-webkit-scrollbar-track,
.purplish-theme .content-wrapper .content-items:hover::-webkit-scrollbar-track,
.purplish-theme
  .content-wrapper
  .content-items-details
  .todo-creator-wrapper
  .field:focus::-webkit-scrollbar-track {
  background: var(--color-black-blue);
}

.bluetiful-theme
  .content-wrapper
  .content-items-details
  .details-wrapper:hover::-webkit-scrollbar-track,
.bluetiful-theme .content-wrapper .content-items:hover::-webkit-scrollbar-track,
.bluetiful-theme
  .content-wrapper
  .content-items-details
  .todo-creator-wrapper
  .field:focus::-webkit-scrollbar-track {
  background: var(--color-steel-blue);
}

.default-theme
  .content-wrapper
  .content-items-details
  .details-wrapper:hover::-webkit-scrollbar-thumb,
.default-theme .content-wrapper .content-items:hover::-webkit-scrollbar-thumb,
.default-theme
  .content-wrapper
  .content-items-details
  .todo-creator-wrapper
  .field:focus::-webkit-scrollbar-thumb {
  background: var(--color-eerie-black);
  border: 0.1em solid var(--color-white);
}

.purplish-theme
  .content-wrapper
  .content-items-details
  .details-wrapper:hover::-webkit-scrollbar-thumb,
.purplish-theme .content-wrapper .content-items:hover::-webkit-scrollbar-thumb,
.purplish-theme
  .content-wrapper
  .content-items-details
  .todo-creator-wrapper
  .field:focus::-webkit-scrollbar-thumb {
  background: var(--color-tickle-me-pink);
  border: 0.12em solid var(--color-russian-violet);
}

.bluetiful-theme
  .content-wrapper
  .content-items-details
  .details-wrapper:hover::-webkit-scrollbar-thumb,
.bluetiful-theme .content-wrapper .content-items:hover::-webkit-scrollbar-thumb,
.bluetiful-theme
  .content-wrapper
  .content-items-details
  .todo-creator-wrapper
  .field:focus::-webkit-scrollbar-thumb {
  background: var(--color-iron-gray);
  border: 0.12em solid var(--color-midnight-blue);
}

/* for browser support */
@supports (scrollbar-color: var(--color-cultured) var(--color-traffic-grey)) {
  * {
    scrollbar-color: var(--color-cultured) var(--color-traffic-grey);
    scrollbar-width: auto;
  }
}

/* start of sign up, login page styles */
.intro {
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--color-eerie-black);
  min-height: calc(100vh - 120px);
}

.intro-text {
  padding: 0 0.875rem;
  text-align: center;
  z-index: 2;
}

.intro-text .title {
  margin-top: 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.intro-text .tagline {
  margin-top: 0.625rem;
  font-size: 0.875rem;
}

.form-wrapper {
  width: 20.625rem;
  margin: 2.5rem auto 0;
  text-align: center;
  z-index: 2;
}

.form-wrapper .title {
  font-size: 1.125rem;
  font-weight: 500;
}

.form-wrapper .tagline {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.form-wrapper form {
  margin-top: 1.875rem;
}

.form-wrapper small {
  font-size: 0.75rem;
}

.form-control {
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
}

.form-control label {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--color-traffic-grey);
  font-size: 0.875rem;
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}

.form-control input {
  width: 100%;
  padding: 0.625rem 1rem;
  background: transparent;
  border: 1px solid var(--color-traffic-grey);
  border-radius: 4px;
  outline: none;
  color: var(--color-eerie-black);
  font-family: inherit;
  font-size: 1rem;
}

.form-control input:focus {
  outline: 1px solid var(--color-eerie-black);
}

.form-control input:not(:placeholder-shown) + label,
.form-control input:focus + label,
.form-control input:valid + label {
  font-size: 0.75rem;
  transform: translateY(-28px);
  background-color: var(--color-cultured);
  color: var(--color-eerie-black);
  padding: 0 3px;
}

.form-control input:-webkit-autofill,
.form-control input:-webkit-autofill:hover,
.form-control input:-webkit-autofill:focus,
.form-control input:-webkit-autofill:active {
  box-shadow: 0 0 0 1.875rem var(--color-cultured) inset !important;
  -webkit-box-shadow: 0 0 0 1.875rem var(--color-cultured) inset !important;
}

.form-control small {
  position: absolute;
  left: 16px;
  bottom: -1.125rem;
  display: flex;
  justify-content: center;
  font-style: italic;
}

.form-control small img {
  margin-right: 5px;
}

.form-control .password-toggle {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  cursor: pointer;
}

.invalid label,
.form-control .error {
  color: var(--color-venetian-red);
}

.invalid input {
  outline: 1px solid var(--color-venetian-red);
}

.submit-button button {
  width: 100%;
  padding: 0.625rem 1rem;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: var(--color-eerie-black);
  color: var(--color-cultured);
  font-family: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.submit-button button span {
  position: absolute;
  left: calc((var(--n) - 1) * 20%);
  width: 20%;
  height: 100%;
  background-color: var(--color-cultured);
  border-radius: 50%;
  transform: translateY(150%);
  transition: 0.5s;
  transition-delay: calc((var(--n) - 1) * 0.1s);
  z-index: -1;
}

/* Give each span element it's own value of "n" */
.submit-button button span:nth-child(1) {
  --n: 1;
}

.submit-button button span:nth-child(2) {
  --n: 2;
}

.submit-button button span:nth-child(3) {
  --n: 3;
}

.submit-button button span:nth-child(4) {
  --n: 4;
}

.submit-button button span:nth-child(5) {
  --n: 5;
}

.submit-button button:hover span {
  transform: translateY(0) scale(2);
}

.submit-button button:hover {
  transition-delay: 0.35s;
  color: var(--color-eerie-black);
}

.meta {
  margin-top: 1.875rem;
  margin-bottom: 2.5rem;
  font-size: 0.875rem;
}

.meta-terms {
  margin-top: 1.125rem;
  color: var(--color-traffic-grey);
}

.meta-google img,
.meta-google button {
  margin-left: 0.3125rem;
}

.meta-google button {
  padding: 3px;
  border: none;
  outline: none;
  background-color: var(--color-cultured);
  border-bottom: 1px solid var(--color-cultured);
  font-family: inherit;
  cursor: pointer;
}

.meta-google button:hover {
  border-bottom: 1px solid var(--color-eerie-black);
}

.meta-login {
  margin-top: 1.125rem;
}

.meta-login a {
  color: inherit;
}

.meta-login a:hover {
  text-decoration: underline;
}

.intro-images {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("./assets/img/bg-left.min.svg"),
    url("./assets/img/bg-right.min.svg");
  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed, fixed;
  background-size: 368px, 368px;
  background-position: left bottom, right bottom;
  z-index: 1;
}
/* end of sign up, login page styles */

/* start of home page styles */
.container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr;
  position: relative;
}

.notification-wrapper {
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 100%;
  z-index: 6;
  background-color: transparent;
}

@media (max-width: 640px) {
  .notification-item .card {
    width: calc(100vw - 4rem) !important;
  }
}

.default-theme .notification-wrapper {
  color: var(--color-eerie-black);
}

.purplish-theme .notification-wrapper {
  color: var(--color-spanish-pink);
}

.bluetiful-theme .notification-wrapper {
  color: var(--color-lavender-gray);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.notification-enter-active {
  transition: all 0.2s ease-out;
}

.notification-leave-from,
.notification-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.notification-leave-active {
  transition: all 0.2s ease-in;
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.notification-move {
  transition: transform 0.5s ease;
}

.content-wrapper {
  grid-column: 2;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 60px 1fr;
  }

  .content-wrapper {
    z-index: 1;
  }
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .content-wrapper {
    grid-column: 1;
    z-index: 1;
  }
}
/* end of home page styles */

/* start of global component styles */
.content-wrapper {
  display: grid;
  grid-template-columns: minmax(auto, 350px) minmax(350px, 1fr);
  grid-template-rows: 1fr;
  width: 100%;
  height: calc(100vh - 80px);
  overflow: hidden;
  position: relative;
}

.content-wrapper.default-theme {
  color: var(--color-eerie-black);
}

.content-wrapper.purplish-theme {
  color: var(--color-spanish-pink);
}

.content-wrapper.bluetiful-theme {
  color: var(--color-lavender-gray);
}

.content-intro-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 1;
}

.default-theme .content-intro-wrapper {
  background-color: var(--color-white);
}

.purplish-theme .content-intro-wrapper {
  background-color: var(--color-black-blue);
  border: 1px dotted var(--color-tickle-me-pink);
}

.bluetiful-theme .content-intro-wrapper {
  background-color: var(--color-steel-blue);
  border: 1px dotted var(--color-iron-gray);
}

.content-intro-wrapper .text {
  position: absolute;
  top: 30%;
  left: 50%;
  padding: 0 0.625rem 1rem;
  width: 100%;
  transform: translateX(-50%);
  z-index: 2;
}

.content-items {
  grid-column: 1;
  position: relative;
  overflow-y: auto;
}

.content-items .results-wrapper {
  padding: 0.375rem 0.875rem;
}

.content-items .results-wrapper .items-title {
  padding: 0;
}

.content-items .results-wrapper .cancel-search-btn {
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50px;
}

.default-theme .content-items .results-wrapper .cancel-search-btn:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .content-items .results-wrapper .cancel-search-btn:hover {
  background-color: var(--color-tickle-me-pink);
}

.purplish-theme .content-items .results-wrapper .cancel-search-btn:hover svg {
  stroke: var(--color-black-blue);
}

.bluetiful-theme .content-items .results-wrapper .cancel-search-btn:hover {
  background-color: var(--color-midnight-blue);
}

.bluetiful-theme .content-items .results-wrapper .cancel-search-btn:hover svg {
  stroke: var(--color-lavender-gray);
}

.content-items .no-results {
  position: absolute;
  top: 50px;
  left: 1rem;
  z-index: 1;
}

.default-theme .content-items {
  background-color: var(--color-cultured);
  border-right: 1px solid var(--color-platinum);
}

.purplish-theme .content-items {
  background-color: var(--color-black-blue);
  border: 1px dotted var(--color-tickle-me-pink);
}

.bluetiful-theme .content-items {
  background-color: var(--color-steel-blue);
  border: 1px dotted var(--color-iron-gray);
}

.content-items-details {
  grid-column: 2;
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  overflow: hidden;
  overflow-y: auto;
}

.default-theme .content-items-details {
  background: var(--color-white);
}

.purplish-theme .content-items-details {
  background: var(--color-black-blue);
  border: 1px dotted var(--color-tickle-me-pink);
}

.bluetiful-theme .content-items-details {
  background: var(--color-steel-blue);
  border: 1px dotted var(--color-iron-gray);
}

.content-intro-wrapper .bg-images,
.content-items-details .bg-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed, fixed;
  z-index: 1;
}

.content-items-details .bg-images {
  background-size: 88px, 190px;
  background-position: 630px center, calc(50vw + 200px) center;
}

.content-intro-wrapper .bg-images {
  background-size: 507px, 190px;
  background-position: calc(50% + 120px) calc(50% + 170px),
    calc(50% + 100px) center;
}

@media (max-width: 1024px) {
  .content-items-details .bg-images {
    background-size: 70px, 152px;
    background-position: 420px center, calc(50vw + 140px) center;
  }

  .content-intro-wrapper .bg-images {
    background-position: calc(50% + 30px) calc(50% + 170px),
      calc(50% + 60px) center;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .content-items {
    grid-column: 1;
  }

  .content-items-details {
    grid-column: 1;
    display: none;
  }

  .content-items-details .bg-images {
    background-size: 88px, 190px;
    background-position: 80px center, calc(50vw - 60px) center;
  }

  .content-intro-wrapper .bg-images {
    background-size: calc(((100vw - 200px)) - 48px),
      calc(((100vw - 300px) / 2) - 32px), cover;
    background-position: center calc(50% + 170px), center center;
  }
}

@media (max-width: 640px) {
  .content-items-details .bg-images {
    background-size: 70px, 152px;
    background-position: 40px center, calc(50vw - 60px) center;
  }

  .content-intro-wrapper .bg-images {
    background-size: calc((100vw) - 48px), calc(((100vw - 100px) / 2) - 32px),
      cover;
    background-position: center calc(50% + 170px), center center;
  }
}

.default-theme .content-items-details .bg-images {
  background-image: url("@/assets/img/text-bg.svg"),
    url("@/assets/img/quill-bg.svg");
}

.purplish-theme .content-items-details .bg-images {
  background-image: url("@/assets/img/text-bg-vertical-purplish.svg"),
    url("@/assets/img/quill-bg-purplish.svg");
}

.bluetiful-theme .content-items-details .bg-images {
  background-image: url("@/assets/img/text-bg-vertical-bluetiful.svg"),
    url("@/assets/img/quill-bg-bluetiful.svg");
}

.default-theme .content-intro-wrapper .bg-images {
  background-image: url("@/assets/img/text-bg-horizontal.svg"),
    url("@/assets/img/quill-bg.svg");
}

.purplish-theme .content-intro-wrapper .bg-images {
  background-image: url("@/assets/img/text-bg-horizontal-purplish.svg"),
    url("@/assets/img/quill-bg-purplish.svg");
}

.bluetiful-theme .content-intro-wrapper .bg-images {
  background-image: url("@/assets/img/text-bg-horizontal-bluetiful.svg"),
    url("@/assets/img/quill-bg-bluetiful.svg");
}

/* ---> start of Todo/Notes list styles */
.items-title {
  padding: 0.625rem 0.875rem;
}

.counter-wrapper {
  position: relative;
  width: 25px;
  height: 25px;
  margin-right: 0.875rem;
  border-radius: 50px;
}

.default-theme .counter-wrapper {
  background-color: var(--color-graphite-black);
  color: var(--color-clouds);
}

.purplish-theme .counter-wrapper {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.bluetiful-theme .counter-wrapper {
  background-color: var(--color-midnight-blue);
  color: var(--color-lavender-gray);
}

.items-title-counter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 500;
}

.item-wrapper {
  position: relative;
  gap: 10px;
  padding: 0.5rem;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  overflow: hidden;
}

.default-theme .item-wrapper {
  outline: 1px solid var(--color-clouds);
  background-color: var(--color-cultured);
  z-index: 2;
}

.purplish-theme .item-wrapper {
  outline: 1px dotted var(--color-tickle-me-pink);
  background-color: var(--color-black-blue);
  z-index: 2;
}

.bluetiful-theme .item-wrapper {
  outline: 1px dotted var(--color-iron-gray);
  background-color: var(--color-steel-blue);
  z-index: 2;
}

.default-theme .item-wrapper.active {
  background-color: var(--color-white);
}

.purplish-theme .item-wrapper.active {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .item-wrapper.active {
  background-color: var(--color-midnight-blue);
}

.item-wrapper.active .indicator span.active {
  display: inline-block;
  width: 0.375rem;
  height: 100%;
  border-radius: 10px;
}

.default-theme .item-wrapper.active .indicator span.active {
  background: rgb(0, 224, 60);
  background: linear-gradient(
    0deg,
    rgba(0, 168, 45, 1) 0%,
    rgba(0, 224, 60, 1) 100%
  );
}

.purplish-theme .item-wrapper.active .indicator span.active {
  background: #ff7aaf;
  background: linear-gradient(
    0deg,
    rgb(255, 122, 175, 1) 0%,
    rgb(253, 199, 189, 1) 100%
  );
}

.bluetiful-theme .item-wrapper.active .indicator span.active {
  background: var(--color-iron-gray);
  background: linear-gradient(
    0deg,
    rgb(84, 94, 105, 1) 0%,
    rgb(198, 201, 205, 1) 100%
  );
}

.text-wrapper {
  width: 100%;
}

.default-theme .item-wrapper:hover {
  background-color: var(--color-clouds);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.purplish-theme .item-wrapper:hover {
  background-color: var(--color-russian-violet);
  box-shadow: rgb(253, 199, 189, 0.3) 0px 1px 2px 0px,
    rgb(253, 199, 189, 0.15) 0px 2px 6px 2px;
}

.bluetiful-theme .item-wrapper:hover {
  background-color: var(--color-midnight-blue);
  box-shadow: rgb(84, 94, 105, 0.3) 0px 1px 2px 0px,
    rgb(84, 94, 105, 0.15) 0px 2px 6px 2px;
}

.default-theme .item-wrapper.default-item {
  background-color: var(--color-eerie-black);
  color: var(--color-honeydew);
}

.purplish-theme .item-wrapper.default-item {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.purplish-theme .item-wrapper.default-item.active .indicator span.active {
  background: var(--color-spanish-pink);
}

.bluetiful-theme .item-wrapper.default-item {
  background-color: var(--color-eerie-black);
  color: var(--color-lavender-gray);
}

.bluetiful-theme .item-wrapper.default-item.active .indicator span.active {
  background: var(--color-iron-gray);
}

.item-wrapper .bg-image {
  position: absolute;
  width: 100%;
  height: 80%;
}

.item-wrapper.default-item .bg-image {
  background-repeat: no-repeat;
  background-size: 80px;
  background-position: right center;
  z-index: 1;
}

.default-theme .item-wrapper.default-item .bg-image {
  background-image: url("@/assets/img/quill-bg-sidebar.svg");
}

.purplish-theme .item-wrapper.default-item .bg-image {
  background-image: url("@/assets/img/quill-bg-sidebar-purplish-alt.svg");
}

.bluetiful-theme .item-wrapper.default-item .bg-image {
  background-image: url("@/assets/img/quill-bg-sidebar-bluetiful.svg");
}

.default-theme .item-wrapper.default-item:hover {
  background-color: var(--color-eerie-black);
  box-shadow: none;
}

.item-wrapper.default-item .text-wrapper {
  position: relative;
  z-index: 2;
}

.title-wrapper {
  width: 100%;
  letter-spacing: 0.5px;
}

.text-wrapper-notes,
.item-list {
  margin-top: 0.5rem;
}
/* ---> end of Todo/Notes list styles */

/* ---> start of Todo/Notes details styles */
.intro-wrapper,
.details-wrapper,
.heading-wrapper {
  position: relative;
  margin: 2.5rem auto 0;
  padding: 0 0.625rem 1rem;
  width: 90%;
  z-index: 2;
}

.intro-wrapper {
  top: 30%;
  text-align: center;
}

.intro-message-1,
.intro-message-2 {
  margin-top: 1rem;
  line-height: 1.4;
}

.intro-message .heading-wrapper {
  z-index: 3;
}

.details-wrapper {
  margin: 0 auto;
  height: calc(100vh - 360px);
  overflow-y: scroll;
  z-index: 1;
}

@media (max-width: 640px) {
  .heading-wrapper {
    margin-top: 1.5rem;
  }

  .details-wrapper {
    margin: 0 0.875rem;
    padding: 0 0.375rem 1rem;
  }
}

.settings-wrapper .title .back-btn-wrapper,
.heading-wrapper .back-btn-wrapper {
  width: 1.875rem;
  height: 1.875rem;
}

.settings-wrapper .title .back-btn,
.heading-wrapper .back-btn {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  border-radius: 50px;
  outline: none;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
}

.settings-wrapper .title .back-btn .head,
.heading-wrapper .back-btn .head {
  position: absolute;
  top: 33%;
  left: 38%;
  display: block;
  width: 0.675rem;
  height: 0.675rem;
  border-top: none !important;
  border-right: none !important;
  transform: rotate(45deg);
}

.default-theme .settings-wrapper .title .back-btn .head {
  border: 2px solid var(--color-pantone-green);
}

.default-theme .heading-wrapper .back-btn .head {
  border: 2px solid var(--color-eerie-black);
}

.purplish-theme .heading-wrapper .back-btn .head,
.purplish-theme .settings-wrapper .title .back-btn .head {
  border: 2px solid var(--color-spanish-pink);
}

.bluetiful-theme .heading-wrapper .back-btn .head,
.bluetiful-theme .settings-wrapper .title .back-btn .head {
  border: 2px solid var(--color-maximum-blue-green);
}

.default-theme .settings-wrapper .title .back-btn:hover {
  background-color: var(--color-graphite-black);
}

.purplish-theme .settings-wrapper .title .back-btn:hover {
  background-color: var(--color-tickle-me-pink);
}

.bluetiful-theme .settings-wrapper .title .back-btn:hover {
  background-color: var(--color-midnight-blue);
}

.default-theme .heading-wrapper .back-btn:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .heading-wrapper .back-btn:hover {
  background-color: var(--color-tickle-me-pink);
}

.purplish-theme .heading-wrapper .back-btn:hover .head {
  border: 2px solid var(--color-black-blue);
}

.bluetiful-theme .heading-wrapper .back-btn:hover {
  background-color: var(--color-midnight-blue);
}

.bluetiful-theme .heading-wrapper .back-btn:hover .head {
  border: 2px solid var(--color-maximum-blue-green);
}

.heading-wrapper .confirm-delete {
  position: absolute;
  top: 2.5rem;
  right: calc(2% + 10px);
  max-width: 18.75rem;
}

.heading-wrapper .confirm-delete-title {
  position: relative;
  padding-bottom: 0.5rem;
  text-align: center;
  border-bottom: 1px solid var(--color-traffic-grey);
}

.heading-wrapper .confirm-delete-title .title {
  display: block;
  width: 100%;
}

.heading-wrapper .confirm-delete-title .close-btn {
  padding: 0.375rem 0.375rem 0.2rem !important;
}

.heading-wrapper .confirm-delete-title .close-btn:hover {
  background-color: var(--color-clouds);
}

.heading-wrapper .confirm-delete-contents {
  margin-top: 0.5rem;
}

.heading-wrapper .confirm-delete-contents .message {
  padding-bottom: 0.5rem;
}

.heading-wrapper .confirm-delete-contents .delete-btn {
  margin-top: 0.5rem;
  width: 100%;
}

.default-theme .heading-wrapper .confirm-delete-contents .delete-btn {
  background-color: var(--color-congo-pink) !important;
}

.default-theme .heading-wrapper .confirm-delete-contents .delete-btn:hover {
  background-color: var(--color-crayola) !important;
}

.purplish-theme .heading-wrapper .confirm-delete-contents .delete-btn {
  background-color: var(--color-tickle-me-pink) !important;
  color: var(--color-black-blue);
}

.purplish-theme .heading-wrapper .confirm-delete-contents .delete-btn:hover {
  background-color: var(--color-spanish-pink) !important;
}

.bluetiful-theme .heading-wrapper .confirm-delete-contents .delete-btn {
  background-color: var(--color-midnight-blue) !important;
  color: var(--color-lavender-gray);
}

.bluetiful-theme .heading-wrapper .confirm-delete-contents .delete-btn:hover {
  background-color: var(--color-iron-gray) !important;
}

.delete-enter-active {
  animation: deleteWindow 0.3s ease-out;
}

.delete-leave-active {
  animation: deleteWindow 0.3s ease-in reverse;
}

@keyframes deleteWindow {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  75% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.heading-wrapper .items-title {
  margin-right: auto;
}

.default-theme .top-controls .delete-todo-btn:hover,
.default-theme .top-controls .delete-note-btn:hover {
  background-color: var(--color-congo-pink);
}

.purplish-theme .top-controls .delete-todo-btn:hover,
.purplish-theme .top-controls .delete-note-btn:hover {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.bluetiful-theme .top-controls .delete-todo-btn:hover,
.bluetiful-theme .top-controls .delete-note-btn:hover {
  background-color: var(--color-midnight-blue);
  color: var(--color-lavender-gray);
}

/* ---> end of Todo/Notes details styles */

/* ---> start of Modal styles */
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.modal-container {
  margin-top: 1rem;
  width: 100%;
}

.modal-title {
  text-align: center;
}

.modal-form {
  margin-top: 1rem;
}

.modal-form .input-wrapper {
  position: relative;
  width: 100%;
}

.default-theme .modal-form .input-wrapper {
  color: var(--color-eerie-black);
}

.bluetiful-theme .modal-form .input-wrapper,
.purplish-theme .modal-form .input-wrapper {
  color: inherit;
}

.modal-form .input-wrapper input {
  width: 100%;
  padding: 0.625rem;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-weight: 600;
  color: inherit;
}

.default-theme .modal-form .input-wrapper textarea::placeholder,
.default-theme .modal-form .input-wrapper input::placeholder {
  font-weight: 400;
  color: var(--color-traffic-grey);
}

.purplish-theme .modal-form .input-wrapper textarea::placeholder,
.purplish-theme .modal-form .input-wrapper input::placeholder {
  font-weight: 400;
  color: rgba(253, 199, 189, 0.8);
}

.bluetiful-theme .modal-form .input-wrapper textarea::placeholder,
.bluetiful-theme .modal-form .input-wrapper input::placeholder {
  font-weight: 400;
  color: rgba(198, 201, 205, 0.4);
}

.modal-form .input-wrapper textarea {
  margin-top: 0.5rem;
  padding: 0.5rem 0.675rem;
  width: 100%;
  height: auto;
  min-height: 3.125rem;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
  background: transparent;
  color: inherit;
}

.modal-form .create-controls {
  margin-top: 1rem;
}

.modal-form .create-controls .btn.btn-cancel {
  margin-left: 0.3125rem;
}

.default-theme .modal-form .create-controls .btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .modal-form .create-controls .btn.btn-cancel:hover {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .modal-form .create-controls .btn.btn-cancel:hover {
  background-color: var(--color-midnight-blue);
}

.default-theme .modal-form .create-controls .btn.btn-add:focus,
.default-theme .modal-form .create-controls .btn.btn-cancel:focus {
  outline: 1px solid var(--color-traffic-grey);
  outline-offset: 3px;
}

.default-theme .modal-form .create-controls .btn.btn-add:focus,
.purplish-theme .modal-form .create-controls .btn.btn-cancel:focus {
  outline: 1px solid var(--color-tickle-me-pink);
  outline-offset: 3px;
}

.bluetiful-theme .modal-form .create-controls .btn.btn-cancel:focus {
  outline: 1px solid var(--color-midnight-blue);
  outline-offset: 3px;
}

.default-theme .modal-form .create-controls .btn.btn-add {
  background-color: var(--color-malachite);
}

.default-theme .modal-form .create-controls .btn.btn-add:hover {
  background-color: var(--color-light-green);
}

.purplish-theme .modal-form .create-controls .btn.btn-add {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.purplish-theme .modal-form .create-controls .btn.btn-add:hover {
  background-color: var(--color-spanish-pink);
}

.bluetiful-theme .modal-form .create-controls .btn.btn-add {
  background-color: var(--color-maximum-blue-green);
  color: var(--color-eerie-black);
}

.bluetiful-theme .modal-form .create-controls .btn.btn-add:hover {
  background-color: var(--color-lavender-gray);
}

.modal-enter-active {
  animation: modal 0.3s ease-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in reverse;
}

@keyframes modal {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  75% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
/* ---> end of Modal styles */
/* end of global component styles */

/* media queries */
@media (max-width: 1200px) {
  .intro-images {
    background-size: calc(((100vw - 400px) / 2) - 32px),
      calc(((100vw - 400px) / 2) - 32px), cover;
  }
}

@media (max-width: 704px) {
  .intro-images {
    background: var(--color-clouds);
  }
}
</style>