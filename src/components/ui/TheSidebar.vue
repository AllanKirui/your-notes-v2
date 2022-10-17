<template>
  <aside :class="themeClasses">
    <div class="sidebar flex flex-fd-c flex-jc-sb">
      <div class="bg-image"></div>
      <div class="sidebar-top">
        <div class="btn-wrapper">
          <button
            class="create-btn"
            :title="`Create ${btnText}`"
            @click="create"
          >
            <div class="flex flex-ai-c">
              <!-- TODO: switch to using an svg to make use currentColor for the stroke-->
              <img
                class="btn-img"
                src="@/assets/img/add-icon.svg"
                alt="create new icon"
                width="18"
              />
              <span class="btn-text">{{ btnText }}</span>
            </div>
          </button>
          <span class="tooltip" :style="{ width: tooltipWidth + 'px' }">{{
            `Create ${btnText}`
          }}</span>
        </div>
        <ul class="links">
          <li class="link">
            <router-link to="/todos" title="Todos">
              <div class="flex flex-ai-c flex-jc-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="4"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <path
                    d="M55.5,23.9V53.5a2,2,0,0,1-2,2h-43a2,2,0,0,1-2-2v-43a2,2,0,0,1,2-2H41.64"
                  />
                  <path
                    d="M19.48,38.77l-.64,5.59a.84.84,0,0,0,.92.93l5.56-.64a.87.87,0,0,0,.5-.24L54.9,15.22a1.66,1.66,0,0,0,0-2.35L51.15,9.1a1.67,1.67,0,0,0-2.36,0L19.71,38.28A.83.83,0,0,0,19.48,38.77Z"
                  />
                  <line x1="44.87" y1="13.04" x2="50.9" y2="19.24" />
                </svg>
                <div class="text-wrapper flex flex-jc-sb">
                  <span class="link-text">Todos</span>
                  <span class="link-counter">{{ numOfTodos }}</span>
                </div>
              </div>
            </router-link>
            <span class="tooltip">Todos</span>
          </li>
          <li class="link">
            <router-link to="/notes" title="Notes">
              <div class="flex flex-ai-c flex-jc-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="4"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <polyline
                    points="34.48 54.28 11.06 54.28 11.06 18.61 23.02 5.75 48.67 5.75 48.67 39.42"
                  />
                  <polyline points="23.04 5.75 23.02 18.61 11.06 18.61" />
                  <line x1="16.21" y1="45.68" x2="28.22" y2="45.68" />
                  <line x1="16.21" y1="39.15" x2="31.22" y2="39.15" />
                  <line x1="16.21" y1="33.05" x2="43.22" y2="33.05" />
                  <line x1="16.21" y1="26.95" x2="43.22" y2="26.95" />
                  <circle
                    cx="42.92"
                    cy="48.24"
                    r="10.01"
                    stroke-linecap="round"
                  />
                  <line x1="42.92" y1="42.76" x2="42.92" y2="53.72" />
                  <line x1="37.45" y1="48.24" x2="48.4" y2="48.24" />
                </svg>
                <div class="text-wrapper flex flex-jc-sb">
                  <span class="link-text">Notes</span>
                  <span class="link-counter">{{ numOfNotes }}</span>
                </div>
              </div>
            </router-link>
            <span class="tooltip">Notes</span>
          </li>
        </ul>
      </div>

      <div class="sidebar-bottom">
        <ul class="links">
          <li class="link">
            <router-link to="/settings" title="Settings">
              <div class="flex flex-ai-c flex-jc-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="4"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <path
                    d="M45,14.67l-2.76,2a1,1,0,0,1-1,.11L37.65,15.3a1,1,0,0,1-.61-.76l-.66-3.77a1,1,0,0,0-1-.84H30.52a1,1,0,0,0-1,.77l-.93,3.72a1,1,0,0,1-.53.65l-3.3,1.66a1,1,0,0,1-1-.08l-3-2.13a1,1,0,0,0-1.31.12l-3.65,3.74a1,1,0,0,0-.13,1.26l1.87,2.88a1,1,0,0,1,.1.89L16.34,27a1,1,0,0,1-.68.63l-3.85,1.06a1,1,0,0,0-.74,1v4.74a1,1,0,0,0,.8,1l3.9.8a1,1,0,0,1,.72.57l1.42,3.15a1,1,0,0,1-.05.92l-2.13,3.63a1,1,0,0,0,.17,1.24L19.32,49a1,1,0,0,0,1.29.09L23.49,47a1,1,0,0,1,1-.1l3.74,1.67a1,1,0,0,1,.59.75l.66,3.79a1,1,0,0,0,1,.84h4.89a1,1,0,0,0,1-.86l.58-4a1,1,0,0,1,.58-.77l3.58-1.62a1,1,0,0,1,1,.09l3.14,2.12a1,1,0,0,0,1.3-.15L50,45.06a1,1,0,0,0,.09-1.27l-2.08-3a1,1,0,0,1-.09-1l1.48-3.43a1,1,0,0,1,.71-.59L53.77,35a1,1,0,0,0,.8-1V29.42a1,1,0,0,0-.8-1l-3.72-.78a1,1,0,0,1-.73-.62l-1.45-3.65a1,1,0,0,1,.11-.94l2.15-3.14A1,1,0,0,0,50,18l-3.71-3.25A1,1,0,0,0,45,14.67Z"
                  />
                  <circle cx="32.82" cy="31.94" r="9.94" />
                </svg>
                <div class="text-wrapper">
                  <span class="link-text">Settings</span>
                </div>
              </div>
            </router-link>
            <span class="tooltip">Settings</span>
          </li>
          <li class="link">
            <!-- TODO: clear google token from local storage is not removed automatically
	window.localStorage.removeItem("token")
	this.$router.push("/signup")

check localStorage in canIuse 
-->
            <a href="https://google.com" title="Logout">
              <div class="flex flex-ai-c flex-jc-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="4"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <polyline points="46.02 21.95 55.93 31.86 46.02 41.77" />
                  <line x1="55.93" y1="31.86" x2="19.59" y2="31.86" />
                  <path
                    d="M40,38.18V52a2.8,2.8,0,0,1-2.81,2.8H12A2.8,2.8,0,0,1,9.16,52V11.77A2.8,2.8,0,0,1,12,9H37.19A2.8,2.8,0,0,1,40,11.77V25"
                  />
                </svg>
                <div class="text-wrapper">
                  <span class="link-text">Logout</span>
                </div>
              </div>
            </a>
            <span class="tooltip">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  emits: ["show-modal", "close-sidebar"],
  computed: {
    ...mapGetters("todos", ["numOfTodos"]),
    ...mapGetters("notes", ["numOfNotes"]),
    ...mapGetters(["theme", "globalFontSize"]),
    routeName() {
      return this.$route.name;
    },
    btnText() {
      let buttonText = "";
      if (this.routeName === "todos") {
        buttonText = "New Todo";
      } else if (this.routeName === "notes") {
        buttonText = "New Note";
      } else {
        buttonText = "New Todo";
      }
      return buttonText;
    },
    themeClasses() {
      let classes = "wrapper ";

      // for default theme
      if (!this.theme) {
        return (classes += "default-theme");
      }

      // for purplish theme
      if (this.theme === "purplish") {
        return (classes += "purplish-theme");
      }

      // for bluetiful theme
      if (this.theme === "bluetiful") {
        return (classes += "bluetiful-theme");
      }

      return classes;
    },
    tooltipWidth() {
      let width = 0;

      switch (this.globalFontSize) {
        case 14:
          width = 128; // 128px
          break;
        case 16:
          width = 144; // 144px
          break;
        case 18:
          width = 160; // 160px
          break;
        default:
          width = 128; // 128px
          break;
      }
      return width;
    },
  },
  methods: {
    create() {
      // emit a custom event to close the sidebar
      this.$emit("close-sidebar");

      // dispatch an action to reset the 'selectedNote' and 'selectedTodo' state prop
      if (this.$route.name === "notes") {
        this.$store.dispatch("notes/resetSelectedNote");
      }

      if (this.$route.name === "todos") {
        this.$store.dispatch("todos/resetSelectedTodo");
      }

      // if route is not notes or todos, switch to todos route
      if (this.$route.name !== "notes" && this.$route.name !== "todos") {
        this.$router.push("/todos");

        // show modal for creating todos
        this.$emit("show-modal", "newTodoFromSettings");
        return;
      }

      // show modal for the specified button i.e notes/todos
      this.$emit("show-modal", this.btnText);
    },
  },
};
</script>

.<style scoped>
.wrapper {
  position: sticky;
  top: 0;
  left: 0;
  grid-column: 1;
  width: 100%;
  height: calc(100vh - 80px);
}

.wrapper.default-theme {
  background-color: var(--color-eerie-black);
}

.wrapper.purplish-theme {
  background-color: var(--color-black-blue);
}

.wrapper.bluetiful-theme {
  background-color: var(--color-steel-blue);
}

.sidebar {
  width: 100%;
  height: 100%;
  position: relative;
}

.sidebar-top,
.sidebar-bottom {
  position: relative;
  z-index: 2;
}

.bg-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 190px;
  background-position: 30px center;
  z-index: 1;
}

.wrapper.default-theme .bg-image {
  background-image: url("@/assets/img/quill-bg-sidebar.svg");
}

.wrapper.purplish-theme .bg-image {
  background-image: url("@/assets/img/quill-bg-sidebar-purplish.svg");
}

.wrapper.bluetiful-theme .bg-image {
  background-image: url("@/assets/img/quill-bg-sidebar-bluetiful.svg");
}

.btn-wrapper {
  text-align: center;
  position: relative;
}

.btn-wrapper .create-btn {
  margin: 0.625rem 0;
  padding: 0.75rem;
  width: 12.5rem;
  border: none;
  outline: none;
  border-radius: 50px;
  text-align: left;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.wrapper.default-theme .btn-wrapper .create-btn {
  background-color: var(--color-dark-pastel-green);
  color: var(--color-eerie-black);
}

.wrapper.purplish-theme .btn-wrapper .create-btn {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.wrapper.bluetiful-theme .btn-wrapper .create-btn {
  background-color: var(--color-maximum-blue-green);
  color: var(--color-eerie-black);
}

.wrapper.default-theme .btn-wrapper .create-btn:hover {
  background: var(--color-platinum);
}

.wrapper.purplish-theme .btn-wrapper .create-btn:hover {
  background-color: var(--color-spanish-pink);
}

.wrapper.bluetiful-theme .btn-wrapper .create-btn:hover {
  background-color: var(--color-lavender-gray);
}

.wrapper.default-theme .btn-wrapper .create-btn:focus {
  outline: 2px solid var(--color-platinum);
  outline-offset: 3px;
}

.wrapper.purplish-theme .btn-wrapper .create-btn:focus {
  outline: 2px solid var(--color-spanish-pink);
  outline-offset: 3px;
}

.wrapper.bluetiful-theme .btn-wrapper .create-btn:focus {
  outline: 2px solid var(--color-maximum-blue-green);
  outline-offset: 3px;
}

.btn-wrapper .create-btn div {
  gap: 0.625rem;
}

.btn-wrapper .create-btn .btn-text {
  font-weight: 500;
}

.links .link {
  font-size: inherit;
  margin-right: 0.3125rem;
}

.links .link a {
  display: inline-block;
  padding: 1rem 1.875rem;
  width: 100%;
  height: 100%;
  transition: all 0.15s ease-in-out;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

.links .link:not(:first-child) a {
  margin-top: 0.5rem;
}

.wrapper.default-theme .links .link a {
  color: var(--color-cultured);
}

.wrapper.purplish-theme .links .link a {
  color: var(--color-tickle-me-pink);
}

.wrapper.bluetiful-theme .links .link a {
  color: var(--color-lavender-gray);
}

.links .link a .text-wrapper {
  margin-left: 0.625rem;
  width: 100%;
}

.wrapper.default-theme .links .link a .link-counter {
  color: var(--color-dark-pastel-green);
}

.wrapper.purplish-theme .links .link a .link-counter {
  color: var(--color-spanish-pink);
}

.wrapper.bluetiful-theme .links .link a .link-counter {
  color: var(--color-maximum-blue-green);
}

.wrapper.default-theme .links .link a:hover {
  background-color: var(--color-platinum);
  color: var(--color-eerie-black);
}

.wrapper.default-theme .links .link a:hover .link-counter {
  color: var(--color-eerie-black);
}

.wrapper.purplish-theme .links .link a:hover {
  background-color: var(--color-spanish-pink);
  color: var(--color-black-blue);
}

.wrapper.purplish-theme .links .link a:hover .link-counter {
  color: var(--color-black-blue);
}

.wrapper.bluetiful-theme .links .link a:hover {
  background-color: var(--color-lavender-gray);
  color: var(--color-eerie-black);
}

.wrapper.bluetiful-theme .links .link a:hover .link-counter {
  color: var(--color-eerie-black);
}

.wrapper.default-theme .router-link-active {
  background: var(--color-graphite-black);
}

.wrapper.purplish-theme .router-link-active {
  background: var(--color-russian-violet);
}

.wrapper.bluetiful-theme .router-link-active {
  background: var(--color-midnight-blue);
}

@media (min-width: 1025px) {
  .btn-wrapper .tooltip,
  .links .link .tooltip {
    display: none;
  }
}

@media (max-width: 1024px) {
  .wrapper {
    position: relative;
  }

  .bg-image {
    background-size: 60px;
    background-position: 5px center;
  }

  .btn-wrapper .create-btn {
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
  }

  .btn-wrapper .create-btn div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-wrapper .create-btn .btn-text {
    display: none;
  }

  .links .link {
    margin-right: 0;
    position: relative;
  }

  .btn-wrapper .tooltip,
  .links .link .tooltip {
    position: absolute;
    top: 0;
    left: 4.5rem;
    transform: translateY(-50%);
    width: 8rem;
    height: 1.875rem;
    border-radius: 8px;
    text-align: center;
    line-height: 1.875rem;
    transition: 0s;
    opacity: 0;
    pointer-events: none;
    z-index: 3;
  }

  .wrapper.default-theme .btn-wrapper .tooltip,
  .wrapper.default-theme .links .link .tooltip {
    background-color: var(--color-cultured);
    color: var(--color-graphite-black);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .wrapper.purplish-theme .btn-wrapper .tooltip,
  .wrapper.purplish-theme .links .link .tooltip {
    background-color: var(--color-spanish-pink);
    color: var(--color-black-blue);
    box-shadow: rgba(255, 122, 175, 0.3) 0px 3px 8px;
  }

  .wrapper.bluetiful-theme .btn-wrapper .tooltip,
  .wrapper.bluetiful-theme .links .link .tooltip {
    background-color: var(--color-lavender-gray);
    color: var(--color-midnight-blue);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .links .link a {
    padding: 1rem 0;
  }

  .links .link a .text-wrapper {
    display: none;
  }

  .btn-wrapper:hover .tooltip,
  .links .link:hover .tooltip {
    top: 50%;
    transition: all 0.3s ease;
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .wrapper {
    position: absolute;
    top: 0;
    left: -255px;
    width: 250px;
    z-index: 2;
    transition: left 0.3s ease-in;
  }

  .wrapper.sidebar-shown {
    left: 0;
  }

  .bg-image {
    background-size: 190px;
    background-position: 30px center;
  }

  .btn-wrapper .create-btn {
    width: 12.5rem;
    height: auto;
    padding: 0.75rem;
  }

  .btn-wrapper .create-btn div {
    justify-content: left;
  }

  .btn-wrapper .create-btn .btn-text {
    display: initial;
  }

  .links .link {
    margin-right: 0.3125rem;
  }

  .btn-wrapper .tooltip,
  .links .link .tooltip {
    display: none;
  }

  .links .link a {
    padding: 1rem 1.875rem;
  }

  .links .link a .text-wrapper {
    display: flex;
    justify-content: space-between;
  }
}
</style>