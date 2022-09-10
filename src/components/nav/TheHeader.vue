<template>
  <header :class="themeClasses" :style="{ 'font-size': fontSize / 16 + 'rem' }">
    <nav class="nav flex flex-ai-c flex-jc-sb">
      <div class="nav-left flex">
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
          <input
            type="text"
            ref="search"
            @keyup="runSearch"
            :placeholder="'Search ' + routeName"
          />
        </div>
      </div>

      <div class="nav-right flex flex-ai-c">
        <div class="nav-avatar flex flex-ai-c flex-jc-c">
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
          </button>
          <!-- TODO: menu goes here-->
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  props: ["fontSize"],
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
      // TODO: don't forget to indicate that you're running a search
      // replacing the Notes and the Todos title

      // TODO: cancel search on route change
      // TODO: when new note/todo button is clicked, cancelSearch

      // close any open notes while searching
      this.$store.dispatch("notes/resetSelectedNote");

      let query = this.$refs.search.value.trim().toLowerCase();
      let notesListElements = document.querySelectorAll(
        ".notes-wrapper li.item-wrapper"
      );

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
      let query = this.$refs.search.value.trim().toLowerCase();
      let todoListElements = document.querySelectorAll(
        ".todos-wrapper li.item-wrapper"
      );
      let todosIncludingTitle = [];

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
      if (this.routeName === "todos") {
        this.runTodosSearch();
      } else if (this.routeName === "notes") {
        this.runNotesSearch();
      }
    },
    cancelSearch() {
      // clear the search field
      this.$refs.search.value = "";
    },
  },
  watch: {
    $route(newRoute) {
      // if there's a new route, clear the search field
      if (newRoute) {
        this.cancelSearch();
      }
    },
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 5rem;
}

.default-theme.header {
  background-color: var(--color-eerie-black);
}

.purplish-theme.header {
  background-color: var(--color-black-blue);
}

.nav {
  padding: 0 1.875rem;
  width: 100%;
  height: 100%;
  color: var(--color-platinum);
}

.nav-logo {
  position: relative;
  margin-right: 3.125rem;
  width: 10.5rem;
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
  width: 25rem;
}

.default-theme .nav-search {
  border-left: 2px solid var(--color-pantone-green);
}

.purplish-theme .nav-search {
  border-left: 2px solid var(--color-tickle-me-pink);
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

.nav-right {
  gap: 20px;
}

.nav-avatar .image-wrapper {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.default-theme .nav-avatar {
  color: var(--color-platinum);
}

.purplish-theme .nav-avatar {
  color: var(--color-spanish-pink);
}

.default-theme .nav-avatar .image-wrapper {
  background-color: var(--color-traffic-grey);
}

.purplish-theme .nav-avatar .image-wrapper {
  background-color: var(--color-russian-violet);
}

.nav-avatar .image-wrapper .avatar {
  position: relative;
  max-width: 100%;
  z-index: 2;
}

.nav-avatar .image-wrapper .initials {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.125rem;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.nav-avatar .username {
  margin-left: 1.125rem;
}

.nav-menu {
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
  outline: 1px solid var(--color-traffic-grey);
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
</style>