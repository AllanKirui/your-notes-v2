<template>
  <section class="content-wrapper">
    <div v-if="!numOfTodos" class="content-intro-wrapper">
      <div class="bg-images"></div>
      <div class="text">
        <h3 class="intro-title">{{ setGreeting(user.displayName) }}</h3>
        <p v-if="screenSize >= 769" class="intro-message-1">
          Please click the <b>New Todo</b> button on the sidebar to create a new
          todo
        </p>
        <p v-else class="intro-message-1">
          Please click the <b>New Todo</b> button on the sidebar or the
          <b>Plus +</b> below to create a new todo
        </p>
      </div>
    </div>

    <!-- Loading spinner -->
    <div
      v-if="!numOfTodos && storedNumOfTodos > 0"
      class="spinner-wrapper spinner-overlay flex flex-jc-c flex-ai-c flex-fd-c"
    >
      <div class="spinner">
        <div class="outer-ring"></div>
        <div class="inner-ring"></div>
      </div>

      <div class="spinner-text">
        <p>Fetching Your Todos</p>
      </div>
    </div>

    <section class="content-items" v-if="numOfTodos">
      <!-- section title with todo counter -->
      <div
        v-if="!isSearching && isShowMobileCounter"
        class="flex flex-ai-c flex-jc-sb"
      >
        <h2 class="items-title">Todos</h2>
        <div class="counter-wrapper">
          <span class="items-title-counter"> {{ numOfTodos }} </span>
        </div>
      </div>

      <!-- section title without todo counter -->
      <h2 v-if="!isSearching && !isShowMobileCounter" class="items-title">
        Todos
      </h2>

      <!-- search window -->
      <div class="results-wrapper flex flex-ai-c flex-jc-sb" v-if="isSearching">
        <h4 class="items-title">{{ searchMessage }}</h4>
        <button
          class="btn cancel-search-btn flex flex-ai-c flex-jc-c"
          title="Cancel search"
          @click="cancelSearch"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            stroke-width="5"
            stroke="currentColor"
            fill="none"
            class="duration-300 transform transition-all"
            style="width: 14px; height: 14px"
          >
            <path d="M8.06 8.06l47.35 47.88M55.94 8.06L8.59 55.94"></path>
          </svg>
        </button>
      </div>
      <p class="no-results">Nothing found ¯\_(ツ)_/¯</p>

      <!-- list of todos -->
      <todo-list :screen-size="screenSize"></todo-list>
    </section>

    <section
      class="content-items-details"
      v-if="numOfTodos"
      :style="mobileFlowStyle"
    >
      <div class="bg-images"></div>
      <todo-details
        :screen-size="screenSize"
        @show-notification="showNotification"
        @selectedtodo-id="setSelectedTodo"
      ></todo-details>
    </section>

    <!-- use the transition component to animate the modal -->
    <transition name="modal">
      <div
        class="modal-wrapper"
        v-if="isModal && activeSide === 'New Todo'"
        @click="closeModal"
      >
        <!-- stop the event propagation from clicking on the modal backdrop -->
        <base-card :mode="cardStyle" @click.stop>
          <div class="modal-container">
            <h3 class="modal-title">Add a New Todo</h3>

            <form class="modal-form" @submit.prevent="addNewTodo">
              <div class="input-wrapper">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  ref="title"
                  :style="{ 'font-size': setFontSize() }"
                />
              </div>

              <div class="input-wrapper">
                <textarea
                  type="text"
                  name="content"
                  placeholder="Enter the first task"
                  ref="newTodo"
                  @input="$nextTick(autoResizeCreateField)"
                ></textarea>
              </div>

              <div class="create-controls">
                <button class="btn btn-add" title="Add new todo" type="submit">
                  Add new todo
                </button>
                <button
                  class="btn btn-cancel"
                  title="Cancel"
                  @click="cancelNewTodo"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </base-card>
      </div>
    </transition>

    <!-- add new todo button -->
    <div class="btn-wrapper" v-if="(screenSize <= 768) & !selectedTodo">
      <button
        class="add-new-btn btn flex flex-ai-c flex-jc-c"
        title="Create New Todo"
        @click="$emit('show-modal', 'New Todo')"
      >
        <img
          class="btn-img"
          src="@/assets/img/add-icon.svg"
          alt="create new icon"
          width="18"
        />
      </button>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

import TodoList from "@/components/todos/TodoList.vue";
import TodoDetails from "@/components/todos/TodoDetails.vue";
import { getAuth } from "firebase/auth";
import { todosColRef, _onSnapshot, _query, _where, _orderBy } from "@/main.js";

export default {
  name: "TheTodos",
  props: ["isModal", "activeSide", "isSearching", "searchMessage"],
  inject: ["setGreeting", "setDate"],
  emits: [
    "close-modal",
    "show-notification",
    "cancel-search",
    "close-sidebar",
    "show-modal",
  ],
  components: {
    TodoList,
    TodoDetails,
  },
  data() {
    return {
      isCreated: false,
      screenSize: null,
      isShowMobileCounter: false,
      isShowMobileFlow: false,
      newTodoId: null,
      unsubscribeFromSnapshotListener: null,
      storedNumOfTodos: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["user"]),
    ...mapGetters(["theme", "globalFontSize", "hasDeletedDefaultTodo"]),
    ...mapGetters("todos", ["todoList", "numOfTodos", "selectedTodo"]),
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
    mobileFlowStyle() {
      let style = "";

      if (this.selectedTodo && this.isShowMobileFlow) {
        style = "display: initial";
      }

      if (!this.selectedTodo && this.isShowMobileFlow) {
        style = "display: none";
      }

      return style;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");

      // dispatch an action to reset the isCloseOpenField state prop
      this.$store.dispatch("todos/closeOpenFields", false);
    },
    addNewTodo() {
      // reset props
      this.isCreated = false;

      let todoTitle = this.$refs.title.value.trim();
      let todoTask = this.$refs.newTodo.value.trim();

      // show notification if the title or task field is empty
      if (!todoTitle || !todoTask) {
        let message = "Please provide a title and one todo task ◉_◉";
        this.showNotification(message);
        return;
      }

      let newTodo = {
        id: this.setId(),
        title: todoTitle,
        contents: [],
        isHideCompleted: false,
        authorId: getAuth().currentUser.uid,
        created: this.setDate(),
        edited: null,
      };

      // add the new task to the contents list
      newTodo.contents.push({ text: todoTask, isCompleted: false });

      // dispatch an action to add the new todo to the todos list
      this.$store.dispatch("todos/addNewTodo", newTodo);

      this.newTodoId = newTodo.id;
      this.isCreated = true;

      // close new todo modal
      this.closeModal();

      // show success notification
      let message = "Added todo successfully \\ (•◡•) /";
      this.showNotification(message);
    },
    setId() {
      // set id to be the current length of the todos list
      let newId = this.numOfTodos;

      // if there are no todos and the default todo has been deleted,
      // set the newId for a newly created todo to be 1
      if (newId === 0 && this.hasDeletedDefaultTodo) {
        newId = 1;
      }

      // loop through each todo item and check for duplicate IDs
      this.todoList.forEach((todo) => {
        if (todo.id === newId) {
          newId++;
        }
      });

      return newId;
    },
    cancelNewTodo() {
      this.closeModal();
    },
    autoResizeCreateField() {
      let textarea = this.$refs.newTodo;
      textarea.style.height = textarea.scrollHeight + "px";
    },
    openNewTodo(id) {
      // dispatch an action to set the newly created todo as the selected todo
      this.$store.dispatch({
        type: "todos/setSelectedTodo",
        todoId: id,
      });
    },
    showNotification(message) {
      this.$emit("show-notification", message);
    },
    setFontSize() {
      let size;

      switch (this.globalFontSize) {
        case 14: // for 14px set title font size to 16px
          size = 16;
          break;
        case 16: // 16px set title font size to 18px
          size = 18;
          break;
        case 18: // 18px set title font size to 20px
          size = 20;
          break;
        default:
          size = 16;
          break;
      }

      return size / 16 + "rem";
    },
    checkWindowSize() {
      // listen to the resize event
      window.addEventListener("resize", () => {
        this.screenSize = window.innerWidth;
      });
    },
    cancelSearch() {
      this.$emit("cancel-search");
    },
    getRealtimeTodoData() {
      const uid = getAuth().currentUser.uid;

      // perform a query to get the current user's todos
      const queryRef = _query(
        todosColRef,
        _where("authorId", "==", uid),
        _orderBy("id")
      );

      // get collection data using onSnapshot (REALTIME)
      // it takes in two arguments; the collection reference and a function that fires
      // every time a snapshot changes and runs once initially to get data
      this.unsubscribeFromSnapshotListener = _onSnapshot(
        queryRef,
        (snapshot) => {
          // dispatch an action to clear the current todo list before adding new data
          this.$store.dispatch("todos/clearTodosList");

          if (!this.hasDeletedDefaultTodo) {
            // dispatch an action to add the Welcome Todo along with the new data
            this.$store.dispatch("todos/addWelcomeTodo");
          }

          snapshot.docs.forEach((todo) => {
            // dispatch an action to set the todo data
            this.$store.dispatch("todos/addRealtimeData", todo);
          });

          // open the newly created todo
          if (this.todoList.length > 0) this.openNewTodo(this.newTodoId);
        }
      );
    },
    setSelectedTodo(id) {
      this.newTodoId = id;
    },
  },
  watch: {
    isModal(newValue) {
      if (newValue) {
        // focus on the input field after the modal has been rendered
        this.$nextTick(() => {
          this.$refs.title.focus();
        });
        // dispatch an action to close any open edit/create menus in TodoDetails
        this.$store.dispatch("todos/closeOpenFields", true);
      }
    },
    screenSize(newSize) {
      if (newSize && newSize >= 1025) {
        this.isShowMobileCounter = false;
      }

      if (newSize && newSize <= 1024) {
        this.isShowMobileCounter = true;
      }

      if (newSize && newSize >= 769) {
        this.isShowMobileFlow = false;
        // close the sidebar for large screens
        this.$emit("close-sidebar");
      }

      if (newSize && newSize <= 768) {
        this.isShowMobileFlow = true;
      }
    },
    numOfTodos(newValue) {
      if (newValue) {
        // dispatch an action to update the user data stored locally
        this.$store.dispatch("updateLocalStorageData", {
          numOfTodos: newValue,
        });
      }
    },
  },
  beforeMount() {
    this.screenSize = window.innerWidth;
  },
  mounted() {
    this.checkWindowSize();
    this.getRealtimeTodoData();

    // read user data from localStorage, if any
    let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));

    if (storedData) {
      this.storedNumOfTodos = storedData.numOfTodos;
    }
  },
  updated() {
    // scroll a newly created todo into view
    if (this.isCreated && this.todoList.length > 0) {
      // after 100ms when the new element has been rendered in the DOM
      setTimeout(() => {
        let newTodoEl = document.querySelector(
          ".content-items .item-wrapper:last-child"
        );
        newTodoEl.scrollIntoView();
      }, 100);

      // reset props
      this.isCreated = false;
    }
  },
  unmounted() {
    // unsubscribe from the real time listener
    this.unsubscribeFromSnapshotListener();
  },
};
</script>