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
              src="@/assets/img/logo.min.svg"
              alt="your notes v2 logo"
              width="168"
              height="27.6"
            />
            <img
              v-else-if="theme === 'purplish'"
              class="logo"
              src="@/assets/img/logo.min-purplish.svg"
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
            src="@/assets/img/search.min.svg"
            alt="search icon"
            width="18"
          />
          <img
            v-else-if="theme === 'purplish'"
            class="search"
            src="@/assets/img/search.min-purplish.svg"
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
        <div class="nav-avatar">
          <div class="image-wrapper">
            <img class="avatar" :src="user.photoURL" alt=" " />
            <span class="initials">{{ setInitials(user.displayName) }}</span>
          </div>
          <p class="username">{{ user.displayName }}</p>
        </div>
        <div class="nav-menu">
          <button class="menu-btn" title="show menu">
            <img v-if="!theme" src="@/assets/img/dropdown.min.svg" alt=" " />
            <img
              v-else-if="theme === 'purplish'"
              src="@/assets/img/dropdown.min-purplish.svg"
              alt=" "
            />
            <img
              v-else-if="theme === 'bluetiful'"
              src="@/assets/img/dropdown-bluetiful.svg"
              alt=" "
            />
          </button>
          <!-- TODO: menu goes here-->
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  props: ["clearSearch", "isOverlayVisible", "isSearching"],
  emits: [
    "reset-cancel",
    "is-searching",
    "set-message",
    "remove-message",
    "toggle-overlay",
    "cancel-search",
  ],
  data() {
    return {
      isSidebarOpen: false,
      isOverlay: false,
    };
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    numOfTodos() {
      return this.$store.getters["todos/numOfTodos"];
    },
    todoList() {
      return this.$store.getters["todos/todoList"];
    },
    numOfNotes() {
      return this.$store.getters["notes/numOfNotes"];
    },
    notesList() {
      return this.$store.getters["notes/notesList"];
    },
    theme() {
      return this.$store.getters.theme;
    },
    globalFontSize() {
      return this.$store.getters.globalFontSize;
    },
    themeClasses() {
      let classes = "header ";

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
  },
  watch: {
    $route(newRoute) {
      // if there's a new route, clear the search field
      if (newRoute) {
        this.cancelSearch();
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
      }
    },
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

.nav-right {
  display: grid;
  grid-template-columns: 1fr 1.25rem;
  grid-template-rows: 1fr;
  gap: 0.625rem;
  align-items: center;
}

.nav-avatar {
  grid-column: 1;
  display: grid;
  grid-template-columns: auto minmax(5rem, auto);
  grid-template-rows: 1fr;
  gap: 0.875rem;
  align-items: center;
}

.nav-avatar .image-wrapper {
  grid-column: 1;
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
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

.default-theme .nav-avatar .image-wrapper {
  background-color: var(--color-traffic-grey);
}

.purplish-theme .nav-avatar .image-wrapper {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .nav-avatar .image-wrapper {
  background-color: var(--color-iron-gray);
}

.nav-avatar .image-wrapper .avatar {
  position: relative;
  z-index: 2;
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

.nav-avatar .username {
  grid-column: 2;
}

.nav-menu {
  grid-column: 2;
  width: 1.25rem;
  height: 1.25rem;
}

.nav-menu .menu-btn {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.default-theme .nav-menu .menu-btn:hover {
  outline: 2px solid var(--color-traffic-grey);
}

.default-theme .nav-menu .menu-btn:focus {
  outline: 1px solid var(--color-traffic-grey);
  outline-offset: 5px;
}

.purplish-theme .nav-menu .menu-btn:hover {
  outline: 1px solid var(--color-tickle-me-pink);
}

.purplish-theme .nav-menu .menu-btn:focus {
  outline: 1px solid var(--color-spanish-pink);
  outline-offset: 5px;
}

.bluetiful-theme .nav-menu .menu-btn:hover {
  outline: 1px solid var(--color-maximum-blue-green);
}

.bluetiful-theme .nav-menu .menu-btn:focus {
  outline: 1px solid var(--color-iron-gray);
  outline-offset: 5px;
}

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

  .nav-right .nav-menu,
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