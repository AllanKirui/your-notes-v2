<template>
  <!-- signup/login pages -->
  <template v-if="!isAuthenticated && !isLoggedIn && isOnline">
    <WelcomeHeader />
    <!-- use the transition component and slotProps to animate components -->
    <router-view name="authn" v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
    <!-- <router-view name="authn"></router-view> -->
  </template>

  <!-- home page -->
  <template v-if="isAuthenticated && isLoggedIn && isOnline">
    <the-header
      :clear-search="isCancelSearch"
      :is-searching="isSearching"
      :isOverlayVisible="isOverlayVisible"
      @is-searching="setSearchingStatus"
      @set-message="setSearchMessage"
      @remove-message="resetSearchingStatus"
      @reset-cancel="resetCancelProp"
      @toggle-overlay="toggleOverlay"
      @cancel-search="cancelSearch"
      @remove-listener="unsubscribeFromSnapshotListeners"
    ></the-header>
    <div
      :class="themeClasses"
      :style="{ 'font-size': globalFontSize / 16 + 'rem' }"
    >
      <the-sidebar
        :class="isOverlayVisible ? 'sidebar-shown' : ''"
        @show-modal="showInputModal"
        @close-sidebar="hideOverlay"
        @remove-listener="unsubscribeFromSnapshotListeners"
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
        @show-modal="showInputModal"
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

  <!-- Offline page -->
  <template v-if="!isOnline">
    <offline-page></offline-page>
  </template>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  preferencesColRef,
  _doc,
  _onSnapshot,
  usernamesColRef,
} from "@/main.js";

import WelcomeHeader from "./components/nav/WelcomeHeader.vue";
import TheHeader from "./components/nav/TheHeader.vue";
import TheSidebar from "./components/ui/TheSidebar.vue";
import OfflinePage from "./components/nav/OfflinePage.vue";

let auth;

export default {
  name: "App",
  components: {
    WelcomeHeader,
    TheHeader,
    TheSidebar,
    OfflinePage,
  },
  data() {
    return {
      isLoggedIn: false,
      isAuthenticated: false,
      isShowInputModal: false,
      notificationQueue: [],
      newNotification: null,
      counter: 0,
      activeSide: null,
      isCancelSearch: false,
      isSearching: false,
      searchMessage: "",
      isOverlayVisible: false,
      unsubscribeFromPreferencesListener: null,
      unsubscribeFromUsernameListener: null,
    };
  },
  computed: {
    isOnline() {
      return this.$store.getters["app/isOnline"];
    },
    theme() {
      return this.$store.getters.theme;
    },
    globalFontSize() {
      return this.$store.getters.globalFontSize;
    },
    cardStyle() {
      let mode = "";

      switch (this.theme) {
        case "purplish":
          mode = "purplish-theme";
          break;
        case "bluetiful":
          mode = "bluetiful-theme";
          break;
        default:
          mode = "default-theme";
          break;
      }

      return mode;
    },
    themeClasses() {
      let classes = "container ";

      switch (this.theme) {
        case "purplish":
          classes += "purplish-theme";
          break;
        case "bluetiful":
          classes += "bluetiful-theme";
          break;
        default:
          classes += "default-theme";
          break;
      }

      return classes;
    },
  },
  methods: {
    setGreeting(name) {
      let today = new Date();
      let hour = today.getHours();
      let greeting = "";
      let trimmedName = "";

      // if name is multi-worded, use the first word of the name
      let wordsInName = name ? name.split(" ") : "You".split();

      if (wordsInName.length > 0) {
        trimmedName = wordsInName[0];
      }

      // set an appropriate greeting based on the time
      if (hour >= 16) {
        greeting = `Good evening, ${trimmedName}`;
      } else if (hour >= 12) {
        greeting = `Good afternoon, ${trimmedName}`;
      } else if (hour >= 0) {
        greeting = `Good morning, ${trimmedName}`;
      }

      return greeting;
    },
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
    getRealtimePreferencesData(uid) {
      // get collection data using onSnapshot (REALTIME)
      this.unsubscribeFromPreferencesListener = _onSnapshot(
        _doc(preferencesColRef, uid),
        (doc) => {
          // dispatch an action to set the current user's preferences if it exists
          if (doc.data())
            this.$store.dispatch("setUserPreferences", doc.data());
        }
      );
    },
    getRealtimeUsernameData(uid) {
      // get collection data using onSnapshot (REALTIME)
      this.unsubscribeFromUsernameListener = _onSnapshot(
        _doc(usernamesColRef, uid),
        (doc) => {
          // dispatch an action to set the current user's profile
          if (doc.data())
            this.$store.dispatch("auth/updateUserProfile", doc.data());
        }
      );
    },
    setDate() {
      let dateList = new Date().toString().split(" ");
      let year = dateList[3]; // holds the year
      let date = dateList[2]; // holds the date
      let month = dateList[1]; // holds the month

      return `${month} ${date}, ${year}`;
    },
    unsubscribeFromSnapshotListeners() {
      // unsubscribe from Firestore's realtime listeners
      this.unsubscribeFromPreferencesListener();
      this.unsubscribeFromUsernameListener();
    },
  },
  watch: {
    isLoggedIn(newValue) {
      // TODO: refine this logic - defect, causes reload to push to "/todos"
      if (newValue) {
        // push to todos route if logged in and going to "/signup" or "/login"
        if (this.$route.name === "signup" || this.$route.name === "login") {
          this.$router.push("/your-notes-v2/todos");
          return;
        }

        // don't push users who are already logged in to the todos page
        if (this.$route.name !== "todos") return;

        // Redirect users who successfully register to the todos page
        this.$router.push("/your-notes-v2/todos");
      }
    },
    $route(newRoute) {
      if (newRoute) {
        let bodyEl = document.querySelector("body");

        if (newRoute.name === "signup" || newRoute.name === "login") {
          bodyEl.className = "overflow-scroll scrollbar-hidden";
        } else {
          bodyEl.className = "";
        }

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
      setGreeting: this.setGreeting,
      setTextLength: this.setTextLength,
      setDate: this.setDate,
    };
  },
  beforeMount() {
    // get user data from local storage
    let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));

    if (storedData) {
      this.isLoggedIn = storedData.isLoggedIn;
    }

    // check if a user is logged in
    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.isAuthenticated = true;

        // dispatch an action to store the authenticated user's data
        this.$store.dispatch("auth/createUserProfile", user);

        this.getRealtimePreferencesData(user.uid);
        this.getRealtimeUsernameData(user.uid);
      } else {
        this.isLoggedIn = false;
        this.isAuthenticated = false;
      }
    });
  },
};
</script>
