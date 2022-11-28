<template>
  <header
    :class="themeClasses"
    :style="{ 'font-size': globalFontSize / 16 + 'rem' }"
  >
    <nav class="nav flex flex-ai-c flex-jc-sb">
      <div class="nav-left">
        <div class="nav-burger">
          <button
            :class="[isSidebarOpen ? 'open' : '', 'burger']"
            :title="isSidebarOpen ? 'Hide Options' : 'Show Options'"
            @click="toggleSidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div class="nav-logo">
          <router-link to="/todos" title="Home">
            <img
              v-if="!theme"
              class="logo"
              src="@/assets/img/logo-default.svg"
              alt="your notes v2 logo"
              width="168"
              height="27.6"
            />
            <img
              v-else-if="theme === 'purplish'"
              class="logo"
              src="@/assets/img/logo-purplish.svg"
              alt="your notes v2 logo"
              width="168"
              height="27.6"
            />
            <img
              v-else-if="theme === 'bluetiful'"
              class="logo"
              src="@/assets/img/logo-bluetiful.svg"
              alt="your notes v2 logo"
              width="168"
              height="27.6"
            />
            <h3 class="logo-text">Your Notes <i>v2</i></h3>
          </router-link>
        </div>
        <!-- search bar visible only for routes with searchable content -->
        <div
          class="nav-search flex flex-jc-c"
          v-if="search.isVisible && search.placeholderName === routeName"
        >
          <img
            v-if="!theme"
            class="search"
            src="@/assets/img/search-default.svg"
            alt="search icon"
            width="18"
          />
          <img
            v-else-if="theme === 'purplish'"
            class="search"
            src="@/assets/img/search-purplish.svg"
            alt="search icon"
            width="18"
          />
          <img
            v-else-if="theme === 'bluetiful'"
            class="search"
            src="@/assets/img/search-bluetiful.svg"
            alt="search icon"
            width="18"
          />
          <input
            type="text"
            ref="search"
            @keyup="runSearch"
            :placeholder="'Search ' + routeName"
          />
        </div>
      </div>

      <div class="nav-right">
        <div class="nav-avatar" @click="toggleMenu">
          <div class="image-wrapper" :title="user.displayName">
            <img
              v-if="userPhotoURL"
              class="avatar"
              :src="userPhotoURL"
              alt=" "
            />
            <span class="initials">{{ setInitials(user.displayName) }}</span>
          </div>
        </div>
      </div>
    </nav>

    <transition name="menu">
      <div class="nav-menu" id="nav-menu" v-if="isMenuOpen">
        <base-card :mode="cardStyle">
          <button class="btn close-btn" title="Close" @click="toggleMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              stroke-width="4.5"
              stroke="currentColor"
              fill="none"
              class="duration-300 transform transition-all"
              style="width: 14px; height: 14px"
            >
              <path d="M8.06 8.06l47.35 47.88M55.94 8.06L8.59 55.94"></path>
            </svg>
          </button>
          <div class="menu-top">
            <div class="image-wrapper">
              <img
                v-if="userPhotoURL"
                class="avatar"
                :src="userPhotoURL"
                alt=" "
              />
              <span class="initials">{{ setInitials(user.displayName) }}</span>
            </div>
            <div class="profile-wrapper">
              <p class="username">{{ user.displayName }}</p>
              <p class="email">{{ user.email }}</p>
            </div>
          </div>

          <div class="menu-bottom">
            <div class="options-links-wrapper">
              <ul class="options-links">
                <li class="link">
                  <button
                    class="btn link-btn"
                    title="Settings"
                    @click="goToSettings"
                  >
                    Settings
                  </button>
                </li>
                <li class="link">
                  <button
                    class="btn link-btn"
                    title="Logout"
                    @click="signUserOut"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
            <div class="meta-membership" v-if="dateJoined">
              <small>{{ dateJoined }}</small>
            </div>
          </div>
        </base-card>
      </div>
    </transition>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { getAuth, signOut } from "firebase/auth";

let auth;

export default {
  name: "TheHeader",
  props: ["clearSearch", "isOverlayVisible", "isSearching"],
  emits: [
    "reset-cancel",
    "is-searching",
    "set-message",
    "remove-message",
    "toggle-overlay",
    "cancel-search",
    "remove-listener",
  ],
  data() {
    return {
      isSidebarOpen: false,
      isOverlay: false,
      isMenuOpen: false,
      dateJoined: null,
    };
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
    ...mapGetters(["theme", "globalFontSize"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("todos", ["numOfTodos", "todoList"]),
    ...mapGetters("notes", ["numOfNotes", "notesList"]),
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
      let classes = "header ";

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
    search() {
      let isSearch = false;
      let name = "";

      if (this.routeName === "todos" && this.numOfTodos) {
        isSearch = true;
        name = this.routeName;
      } else if (this.routeName === "notes" && this.numOfNotes) {
        isSearch = true;
        name = this.routeName;
      }

      return { isVisible: isSearch, placeholderName: name };
    },
    userPhotoURL() {
      let url = "";

      // use the 'photoURL' from Google if it's available
      if (this.user.photoURL) {
        url = this.user.photoURL;
      } else {
        // create a custom avatar from https://avatars.dicebear.com
        if (this.user.displayName) {
          let firstWordInUsername = this.user.displayName.split(" ")[0];
          url = `https://avatars.dicebear.com/api/bottts/${firstWordInUsername}.svg`;
        } else {
          url = "";
        }
      }

      return url;
    },
  },
  methods: {
    toggleSidebar() {
      // emit a custom event to clear search field if it's active
      if (this.isSearching) {
        let searchTerm = this.$refs.search ? this.$refs.search.value : null;
        if (searchTerm) {
          this.$emit("cancel-search");
        }
      }

      this.isSidebarOpen = !this.isSidebarOpen;
      this.isOverlay = !this.isOverlay;

      // emit a custom event to show the overlay
      this.$emit("toggle-overlay", this.isOverlay);
    },
    setInitials(name) {
      if (!name) {
        return "You";
      }

      let initials = "";
      let wordsInName = name.split(" ");

      // check if the username is multi-worded
      if (wordsInName.length > 1) {
        let firstWord = wordsInName[0];
        let secondWord = wordsInName[1];

        // return the first letter of the first two words
        initials = firstWord.split("")[0] + secondWord.split("")[0];
        return initials;
      }
      // return the first letter of the only available word
      return wordsInName[0].split("")[0];
    },
    runNotesSearch() {
      // close any open notes while searching
      this.$store.dispatch("notes/resetSelectedNote");

      let query = this.$refs.search.value.trim().toLowerCase();
      let notesListElements = document.querySelectorAll(
        ".notes-wrapper li.item-wrapper"
      );

      // remove search message if query is empty
      if (!query) this.$emit("remove-message");

      // loop through all list elements
      notesListElements.forEach((el, index) => {
        // grab the title's string
        let titleElText = el
          .querySelector(".text-wrapper .title-wrapper .item-title")
          .textContent.toLowerCase();

        // get the note content string from the store element with a matching index
        let notesContent = this.notesList[index].content.toLowerCase();

        // concatenate the note title and contents to get a string that includes both
        let allWordsInNote = titleElText + " " + notesContent;

        // search the concatenated string for the query
        if (allWordsInNote.includes(query)) {
          // show the matching element by doing nothing
          el.style.display = "";
        } else {
          // hide the elements that don't match
          el.style.display = "none";
        }
      });
    },
    runTodosSearch() {
      // close any open todos while searching
      this.$store.dispatch("todos/resetSelectedTodo");

      let query = this.$refs.search.value.trim().toLowerCase();
      let todoListElements = document.querySelectorAll(
        ".todos-wrapper li.item-wrapper"
      );
      let todosIncludingTitle = [];

      // remove search message if query is empty
      if (!query) this.$emit("remove-message");

      // loop through all list elements
      todoListElements.forEach((el, index) => {
        // grab the title's string
        let titleElText = el
          .querySelector(".text-wrapper .title-wrapper .item-title")
          .textContent.toLowerCase();

        // map through each todo and return the text of each todo task
        let tasksList = [];
        tasksList = this.todoList[index].contents.map((task) =>
          task.text.toLowerCase()
        );

        // add the todo title to the list of todo tasks
        tasksList.push(titleElText);

        // add the tasksList to the list of todos that include the title
        todosIncludingTitle.push(tasksList);
      });

      // join the todos
      todosIncludingTitle = todosIncludingTitle.map((todo) => todo.join(" "));

      // search through the joined todos for the query
      todosIncludingTitle.forEach((todo, index) => {
        if (todo.includes(query)) {
          // show the matching element by doing nothing
          todoListElements[index].style.display = "";
        } else {
          // hide the elements that don't match
          todoListElements[index].style.display = "none";
        }
      });
    },
    runSearch() {
      // reset props
      this.isMenuOpen = false;

      // emit an event to set searching status and search message
      this.$emit("is-searching");
      this.$emit("set-message", this.$refs.search.value.trim().toLowerCase());

      if (this.routeName === "todos") {
        this.runTodosSearch();
      } else if (this.routeName === "notes") {
        this.runNotesSearch();
      }
    },
    cancelSearch() {
      // clear the search field if it is shown
      if (this.$refs.search) {
        this.$refs.search.value = "";
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    goToSettings() {
      // go to the settings route
      this.$router.push("/settings");

      // close the menu
      this.isMenuOpen = false;
    },
    async signUserOut() {
      // go to the signup route
      this.$router.push("/");

      // emit a custom event to remove real-time snapshot listener
      this.$emit("remove-listener");

      // dispatch an action to update the user data stored locally
      this.$store.dispatch("updateLocalStorageData", {
        isLoggedIn: false,
      });

      try {
        await signOut(auth);
      } catch (error) {
        alert("Oops! Something went terribly wrong ◔ ⌣ ◔");
      }
    },
    getDateJoined(auth) {
      let timestamp = +auth.currentUser.metadata.createdAt;
      let dateList = new Date(timestamp).toString().split(" ");
      let year = dateList[3]; // holds the year
      let month = dateList[1].toLowerCase(); // holds the month

      switch (month) {
        case "jan":
          month = "January";
          break;
        case "feb":
          month = "February";
          break;
        case "mar":
          month = "March";
          break;
        case "apr":
          month = "April";
          break;
        case "may":
          month = "May";
          break;
        case "jun":
          month = "June";
          break;
        case "jul":
          month = "July";
          break;
        case "aug":
          month = "August";
          break;
        case "sep":
          month = "September";
          break;
        case "oct":
          month = "October";
          break;
        case "nov":
          month = "November";
          break;
        case "dec":
          month = "December";
          break;
      }

      if (!month || !year) return;

      this.dateJoined = `Member since ${month}, ${year}`;
    },
  },
  watch: {
    $route(newRoute) {
      // if there's a new route, clear the search field, close the menu
      if (newRoute) {
        this.cancelSearch();
        this.isMenuOpen = false;
      }
    },
    clearSearch(newValue) {
      if (newValue) {
        this.cancelSearch();

        // set the display property of todos/notes list elements
        if (this.routeName === "todos") {
          let todoListElements = document.querySelectorAll(
            ".todos-wrapper li.item-wrapper"
          );
          todoListElements.forEach((el) => (el.style.display = ""));
        } else if (this.routeName === "notes") {
          let notesListElements = document.querySelectorAll(
            ".notes-wrapper li.item-wrapper"
          );
          notesListElements.forEach((el) => (el.style.display = ""));
        }

        // reset the isCancelSearch prop in App
        this.$emit("reset-cancel");
      }
    },
    isOverlayVisible(newValue) {
      if (!newValue) {
        // reset props
        this.isOverlay = false;
        this.isSidebarOpen = false;
      } else {
        this.isMenuOpen = false;
      }
    },
    isMenuOpen(newValue) {
      if (newValue) {
        let self = this;

        // close menu when elements outside it are clicked outside
        window.addEventListener("click", (e) => {
          if (!self.$el.contains(e.target)) {
            self.isMenuOpen = false;
          }
        });

        // reset props
        this.isOverlay = false;
        this.isSidebarOpen = false;

        // emit a custom event to hide the overlay
        this.$emit("toggle-overlay", this.isOverlay);
      }
    },
  },
  mounted() {
    auth = getAuth();

    this.getDateJoined(auth);
  },
};
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 5rem;
}

.default-theme.header {
  background-color: var(--color-eerie-black);
}

.purplish-theme.header {
  background-color: var(--color-black-blue);
}

.bluetiful-theme.header {
  background-color: var(--color-steel-blue);
}

.nav {
  padding: 0 1.875rem;
  width: 100%;
  height: 100%;
  gap: 1.25rem;
  color: var(--color-platinum);
}

.nav-left {
  display: grid;
  grid-template-columns: 10.5rem minmax(auto, 25rem);
  grid-template-rows: 1fr;
  gap: 3.125rem;
}

.nav-logo {
  position: relative;
}

.logo {
  position: relative;
  max-width: 100%;
  z-index: 2;
}

.logo-text {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: var(--color-cultured);
  text-align: center;
  z-index: 1;
}

.nav-search {
  font-weight: 400;
  padding: 5px 0;
}

.default-theme .nav-search {
  border-left: 2px solid var(--color-pantone-green);
}

.purplish-theme .nav-search {
  border-left: 2px solid var(--color-tickle-me-pink);
}

.bluetiful-theme .nav-search {
  border-left: 2px solid var(--color-maximum-blue-green);
}

.nav-search img {
  margin-left: 0.75rem;
}

.nav-search input {
  padding: 0 5px;
  margin-left: 0.625rem;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
}

.default-theme .nav-search input,
.default-theme .nav-search input::placeholder {
  color: var(--color-platinum);
  letter-spacing: 0.2px;
}

.purplish-theme .nav-search input,
.purplish-theme .nav-search input::placeholder {
  color: rgba(253, 199, 189, 0.8);
  letter-spacing: 0.2px;
}

.bluetiful-theme .nav-search input,
.bluetiful-theme .nav-search input::placeholder {
  color: var(--color-lavender-gray);
  letter-spacing: 0.2px;
}

.nav-avatar .image-wrapper {
  grid-column: 1;
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.default-theme .nav-avatar {
  color: var(--color-platinum);
}

.purplish-theme .nav-avatar {
  color: var(--color-spanish-pink);
}

.bluetiful-theme .nav-avatar {
  color: var(--color-lavender-gray);
}

.default-theme .menu-top .image-wrapper {
  background-color: var(--color-traffic-grey);
}

.default-theme .nav-avatar .image-wrapper {
  background-color: var(--color-graphite-black);
}

.purplish-theme .menu-top .image-wrapper,
.purplish-theme .nav-avatar .image-wrapper {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .menu-top .image-wrapper,
.bluetiful-theme .nav-avatar .image-wrapper {
  background-color: var(--color-midnight-blue);
}

.nav-avatar .image-wrapper .avatar {
  position: relative;
  z-index: 2;
  max-width: 100%;
}

.nav-avatar .image-wrapper .initials {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

/* start of nav menu styles */
.nav-menu {
  position: absolute;
  top: 70px;
  right: 50px;
  z-index: 2;
}

.nav-menu .card {
  padding: 0;
  position: relative;
}

@media (max-width: 540px) {
  .nav-menu {
    right: 0;
    left: 0;
  }

  .nav-menu .card {
    margin: 0 auto;
    width: 95%;
  }
}

.nav-menu .card .close-btn {
  position: absolute;
  top: 0.675rem;
  right: 0.675rem;
  padding: 0.375rem 0.375rem 0.2rem;
  z-index: 3;
}

.default-theme .nav-menu .close-btn {
  color: var(--color-cultured);
}

.default-theme .nav-menu .close-btn:hover {
  background-color: var(--color-graphite-black);
}

.purplish-theme .nav-menu .close-btn:hover {
  background-color: var(--color-black-blue);
}

.bluetiful-theme .nav-menu .close-btn:hover {
  background-color: var(--color-steel-blue);
  color: var(--color-lavender-gray);
}

.nav-menu .menu-top {
  padding: 1.375rem 0.75rem 0.75rem;
  position: relative;
}

.menu-top .image-wrapper {
  position: absolute;
  top: 1.45rem;
  left: 0.75rem;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
}

.default-theme .menu-top {
  background-color: var(--color-eerie-black);
  color: var(--color-cultured);
}

.default-theme .menu-top img {
  background-color: var(--color-graphite-black);
}

.purplish-theme .menu-top {
  background-color: var(--color-russian-violet);
}

.purplish-theme .menu-top img {
  background-color: var(--color-black-blue);
}

.bluetiful-theme .menu-top {
  background-color: var(--color-midnight-blue);
}

.bluetiful-theme .menu-top img {
  background-color: var(--color-midnight-blue);
}

.default-theme .menu-top .image-wrapper {
  outline: 1px solid var(--color-traffic-grey);
}

.purplish-theme .menu-top .image-wrapper {
  outline: 1px solid var(--color-russian-violet);
}

.bluetiful-theme .menu-top .image-wrapper {
  outline: 1px solid var(--color-iron-gray);
}

.menu-top .image-wrapper .avatar {
  position: relative;
  z-index: 2;
  max-width: 100%;
}

.menu-top .image-wrapper .initials {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.75rem;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.menu-top .profile-wrapper {
  margin-left: 6rem;
  margin-top: 0.5rem;
}

.menu-top .profile-wrapper .username {
  font-weight: 500;
}

.menu-top .profile-wrapper .email {
  margin-top: 4px;
  font-size: 12px;
}

.menu-bottom {
  padding-top: 2rem;
}

.options-links-wrapper .options-links .link .link-btn {
  margin: 0.275rem 0;
  padding: 0.5rem 0.75rem;
  width: 100%;
  text-align: left;
  border-radius: 0;
}

.default-theme .options-links-wrapper .options-links .link:last-child {
  border-top: 1px solid var(--color-traffic-grey);
}

.purplish-theme .options-links-wrapper .options-links .link:last-child {
  border-top: 1px solid var(--color-russian-violet);
}

.bluetiful-theme .options-links-wrapper .options-links .link:last-child {
  border-top: 1px solid var(--color-midnight-blue);
}

.default-theme .options-links .link .link-btn:hover {
  background-color: var(--color-graphite-black);
  color: var(--color-cultured);
}

.purplish-theme .options-links .link .link-btn:hover {
  background-color: var(--color-spanish-pink);
  color: var(--color-black-blue);
}

.bluetiful-theme .options-links .link .link-btn:hover {
  background-color: var(--color-midnight-blue);
}

.meta-membership {
  padding: 0.3rem 0;
  text-align: center;
}
/* end of nav menu styles */

/* media queries */
@media (max-width: 768px) {
  header {
    z-index: 2;
  }

  .nav {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 98%;
    height: 70%;
    padding: 1.125rem;
    border-radius: 50px;
  }

  .default-theme .nav {
    background-color: var(--color-graphite-black);
  }

  .purplish-theme .nav {
    background-color: var(--color-russian-violet);
  }

  .bluetiful-theme .nav {
    background-color: var(--color-midnight-blue);
  }

  .nav-left {
    grid-template-columns: auto minmax(auto, 25rem);
    gap: 0.875rem;
    align-items: center;
  }

  .nav-left .nav-logo {
    display: none;
  }

  .nav-left .nav-burger {
    grid-column: 1;
  }

  .nav-left .nav-burger .burger {
    width: fit-content;
    padding: 0;
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    z-index: 2;
  }

  .nav-left .nav-burger .burger span {
    display: block;
    position: relative;
    top: 0;
    width: 24px;
    height: 2px;
    transition: 0.3s ease transform, 0.3s ease top, 0.3s ease width,
      0.3s ease right;
    border-radius: 2px;
  }

  .default-theme .nav-left .nav-burger .burger span {
    background-color: var(--color-pantone-green);
  }

  .purplish-theme .nav-left .nav-burger .burger span {
    background-color: var(--color-tickle-me-pink);
  }

  .bluetiful-theme .nav-left .nav-burger .burger span {
    background-color: var(--color-maximum-blue-green);
  }

  .nav-left .nav-burger .burger span:not(:last-child) {
    margin-bottom: 5px;
  }

  .nav-left .nav-burger .burger span:nth-child(odd) {
    width: 12px;
  }

  .nav-left .nav-burger .burger span:last-child {
    transform: translateX(100%);
  }

  .nav-left .nav-burger .burger.open span:nth-child(even) {
    transform: rotateZ(-45deg);
  }

  .nav-left .nav-burger .burger.open span:first-child {
    transform: rotateZ(45deg);
    transform-origin: 3px 5px;
  }

  .nav-left .nav-burger .burger.open span:last-child {
    transform: rotateZ(45deg);
    transform-origin: 14px 12px;
  }

  .nav-search img {
    margin-left: 0;
  }

  .bluetiful-theme .nav-search,
  .purplish-theme .nav-search,
  .default-theme .nav-search {
    border: none;
  }

  .nav-right {
    grid-template-columns: 1fr;
  }

  .nav-right .nav-avatar {
    grid-template-columns: 1fr;
  }

  /* .nav-right .nav-menu, */
  .nav-right .nav-avatar .username {
    display: none;
  }
}

@media (min-width: 769px) {
  .nav-left .nav-burger {
    display: none;
  }
}
</style>