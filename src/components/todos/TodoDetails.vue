<template>
  <div v-if="!hasTodo" class="intro-wrapper">
    <h3 class="intro-title">{{ greeting }}</h3>
    <p class="intro-message-1">
      Please select a todo from the <b>Todos</b> panel to continue working on an
      existing todo
    </p>
    <p class="intro-message-2">
      Or click the <b>New Todo</b> button on the sidebar to create a new todo
    </p>
  </div>

  <!-- Todo title and progress bar -->
  <div v-if="hasTodo" class="heading-wrapper">
    <div class="heading-top flex flex-ai-c">
      <div class="back-btn-wrapper">
        <button
          class="back-btn"
          title="Back to list of todos"
          v-if="screenSize <= 768"
          @click="resetSelectedTodo"
        >
          <span class="head"></span>
        </button>
      </div>
      <h3 class="items-title">{{ selectedTodo.title }}</h3>
      <div class="top-controls flex flex-ai-c">
        <button
          v-if="hasCompletedItems"
          @click="toggleCompletedItems(selectedTodo.isHideCompleted)"
          class="btn hide-btn"
          :title="
            selectedTodo.isHideCompleted
              ? 'Hide completed tasks'
              : 'Show completed tasks'
          "
        >
          {{ selectedTodo.isHideCompleted ? "Hide" : "Show" }} completed
        </button>
        <button
          class="btn delete-todo-btn"
          title="Delete todo"
          @click="showDeleteWindow"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="heading-bottom progress-bar flex flex-ai-c">
      <span class="percentage">{{ progress }}%</span>
      <div class="bar-wrapper flex flex-ai-c">
        <span class="bar" :style="{ width: progress + '%' }"></span>
      </div>
    </div>

    <!-- use the transition component to animate the delete window-->
    <transition name="delete">
      <div class="confirm-delete" v-if="isShowDeleteWindow">
        <base-card :mode="cardStyle">
          <div class="confirm-delete-title flex flex-ai-c flex-jc-sb">
            <span class="title"
              >Delete {{ setTextBasedOnFontSize(selectedTodo.title) }}</span
            >
            <button
              class="btn close-btn"
              title="Close"
              @click="hideDeleteWindow"
            >
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
          </div>
          <div class="confirm-delete-contents">
            <p class="message">
              Deleting a todo is a permanent action which cannot be undone.
            </p>
            <button
              class="btn delete-btn"
              title="Delete todo"
              @click="deleteTodo"
            >
              Delete todo
            </button>
          </div>
        </base-card>
      </div>
    </transition>

    <!-- show this if there are no tasks in a todo -->
    <div v-if="!selectedTodo.contents.length" class="contents-info">
      <p>This todo is empty, please add some new tasks</p>
    </div>
  </div>

  <div v-if="hasTodo" class="details-wrapper">
    <!-- list of uncompleted items -->
    <div class="incomplete-items">
      <ul class="items">
        <li v-for="(item, index) of selectedTodo.contents" :key="index">
          <!-- only shows incomplete items -->
          <div class="item flex" v-if="!item.isCompleted">
            <div class="item-checkbox">
              <input
                type="checkbox"
                v-model="item.isCompleted"
                @change="checkHandler(index, item.isCompleted)"
              />
            </div>

            <div class="item-text-wrapper">
              <div class="item-text" v-if="selectedItem !== index">
                <span
                  class="item-details"
                  :class="{ completed: item.isCompleted }"
                  @click="editText(index)"
                  >{{ item.text }}</span
                >
              </div>
              <!-- only show for the clicked todo item -->
              <div
                class="item-edit-field"
                v-if="isEditText && selectedItem === index"
              >
                <textarea
                  class="field"
                  type="text"
                  :value="item.text"
                  ref="editTask"
                  @input="$nextTick(autoResizeEditField)"
                ></textarea>
                <div class="edit-controls">
                  <button
                    class="btn btn-save"
                    title="Save edits"
                    @click="saveEdits(index)"
                  >
                    Save
                  </button>
                  <button
                    class="btn btn-cancel"
                    title="Cancel edits"
                    @click="cancelEdits"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div
              :class="[
                isEditText && selectedItem === index ? 'visible' : '',
                'item-options',
              ]"
            >
              <button
                class="btn delete-item-btn"
                title="Delete task"
                @click="deleteTodoTask(index)"
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
          </div>
        </li>
      </ul>
    </div>

    <!-- list of completed items -->
    <div
      class="completed-items"
      v-if="hasCompletedItems && selectedTodo.isHideCompleted"
    >
      <br />
      <hr :style="hrStyle" />
      <p>{{ completedItemsFieldText }}</p>
      <ul class="items completed">
        <li v-for="(item, index) of selectedTodo.contents" :key="index">
          <!-- only shows completed items -->
          <div class="item flex" v-if="item.isCompleted">
            <div class="item-checkbox">
              <input
                type="checkbox"
                v-model="item.isCompleted"
                @change="checkHandler(index, item.isCompleted)"
              />
            </div>

            <div class="item-text-wrapper">
              <div class="item-text" v-if="selectedItem !== index">
                <span
                  class="item-details"
                  :class="{ completed: item.isCompleted }"
                  @click="editText(index)"
                  >{{ item.text }}</span
                >
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- field to create a new todo task -->
  <div v-if="hasTodo" class="todo-creator-wrapper">
    <div class="item-create-btn" v-if="!isCreateNewTask">
      <button
        class="btn btn-add"
        title="Add new task"
        @click="showNewTaskField"
      >
        Add new task
      </button>
    </div>

    <div class="item-create-field" v-if="isCreateNewTask">
      <textarea
        class="field"
        type="text"
        ref="newTask"
        placeholder="Add new todo task"
      ></textarea>
      <div class="create-controls">
        <button
          class="btn btn-add"
          title="Add new task"
          @click="addNewTodoTask"
        >
          Add new task
        </button>
        <button
          class="btn btn-cancel"
          title="Cancel"
          @click="cancelNewTodoTask"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  db,
  _doc,
  _updateDoc,
  _arrayUnion,
  _deleteDoc,
  _arrayRemove,
} from "@/main.js";

export default {
  emits: ["show-notification", "selectedtodo-id"],
  props: ["screenSize"],
  inject: ["setTextLength"],
  data() {
    return {
      hasTodo: false,
      isEditText: false,
      selectedItem: null,
      isChecked: false,
      parentTodoId: null,
      isCreateNewTask: false,
      isCreated: false,
      hasSwitchedTodos: false,
      hasCompletedItems: false,
      numOfCompletedItems: 0,
      progress: 0,
      isHighlighted: false,
      isShowDeleteWindow: false,
      isMobileView: false,
      firestoreDocId: null,
    };
  },
  computed: {
    ...mapGetters("todos", ["selectedTodo", "isCloseOpenFields"]),
    ...mapGetters(["greeting", "theme", "globalFontSize"]),
    completedItemsFieldText() {
      return this.numOfCompletedItems > 1
        ? `${this.numOfCompletedItems} Completed items`
        : `${this.numOfCompletedItems} Completed item`;
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
    hrStyle() {
      let style = "";

      // for default theme
      if (!this.theme) {
        style = "border-color: #1a1a1a";
      }

      // for purplish theme
      if (this.theme === "purplish") {
        style = "border-color: #ff7aaf";
      }

      // for bluetiful theme
      if (this.theme === "bluetiful") {
        style = "border-color: #545e69";
      }

      return style;
    },
  },
  methods: {
    editText(index) {
      // reset props
      this.isHighlighted = false;
      this.isShowDeleteWindow = false;
      // don't open edit field if todo is marked as completed
      if (this.selectedTodo.contents[index].isCompleted) return;
      // close the create new todo field if it's open
      if (this.isCreateNewTask) this.cancelNewTodoTask();

      this.selectedItem = index;
      this.isEditText = true;

      // resize the textarea after it has been rendered
      this.$nextTick(() => {
        this.autoResizeEditField();
      });
    },
    autoResizeEditField() {
      let textarea = this.$refs.editTask[0];
      textarea.style.height = textarea.scrollHeight + "px";

      // if the textarea is already focused and selected, return
      if (this.isHighlighted) return;

      // focus on the textarea and highlight its contents
      textarea.focus();
      textarea.select();
      this.isHighlighted = true;
    },
    cancelEdits() {
      // reset props
      this.selectedItem = null;
      this.isEditText = false;
    },
    checkHandler(index, isCompleted) {
      // close the create new todo field if it's open
      if (this.isCreateNewTask) this.cancelNewTodoTask();
      if (this.isEditText) this.cancelEdits();

      this.isChecked = isCompleted;

      // dispatch an action to set completed status of a checked todo item
      this.$store.dispatch({
        type: "todos/updateCompletionStatus",
        status: this.isChecked,
        parentTodoId: this.parentTodoId,
        childTodoId: index,
        firestoreDocId: this.firestoreDocId,
        db: db,
        doc: _doc,
        updateDoc: _updateDoc,
        arrayRemove: _arrayRemove,
        arrayUnion: _arrayUnion,
      });

      // reset prop
      this.isChecked = false;
    },
    saveEdits(index) {
      let updatedText = this.$refs.editTask[0].value;

      // dispatch an action to save changes made on a todo item
      this.$store.dispatch({
        type: "todos/saveChanges",
        parentTodoId: this.parentTodoId,
        childTodoId: index,
        newText: updatedText,
      });

      // close the editing window by resetting props
      this.selectedItem = null;
      this.isEditText = false;
    },
    showNewTaskField() {
      // close the edit todo field if it's open
      this.cancelEdits();
      this.isCreateNewTask = true;

      // focus on the create new todo textarea after it's shown
      this.$nextTick(() => {
        this.$refs.newTask.focus();
      });
    },
    cancelNewTodoTask() {
      // reset props
      this.isCreateNewTask = false;
    },
    addNewTodoTask() {
      // close the edit todo field if it's open
      if (this.isEditText) this.cancelEdits();
      this.isCreated = false;

      let newTask = this.$refs.newTask.value.trim();

      // dispatch an action to add a new todo item
      if (newTask) {
        this.$store.dispatch({
          type: "todos/addNewTodoTask",
          firestoreDocId: this.firestoreDocId,
          newTask: newTask,
          db: db,
          doc: _doc,
          updateDoc: _updateDoc,
          arrayUnion: _arrayUnion,
        });
      }

      this.isCreated = true;

      // clear the field and re-focus on it
      this.$refs.newTask.value = "";
      this.$refs.newTask.focus();
    },
    setProgress(totalItems, completed) {
      return Math.round((completed / totalItems) * 100);
    },
    toggleCompletedItems(isHidden) {
      // dispatch an action to set hidden status of completed tasks in a todo
      this.$store.dispatch({
        type: "todos/updateHiddenStatus",
        parentTodoId: this.parentTodoId,
        firestoreDocId: this.firestoreDocId,
        db: db,
        doc: _doc,
        updateDoc: _updateDoc,
      });

      if (this.hasCompletedItems) {
        if (!isHidden) {
          // after 100ms when the realtime data has been rendered in the DOM
          setTimeout(() => {
            // scroll completed items into view when 'show completed' button is clicked
            this.$nextTick(() => {
              let completedItems = document.querySelector(".completed-items");
              completedItems.scrollIntoView();
              console.log("Scrolled into view");
            });
          }, 100);
        } else {
          // scroll incomplete items into view
          let incompleteItems = document.querySelector(".incomplete-items");
          incompleteItems.scrollIntoView();
        }
      }
    },
    showDeleteWindow() {
      this.cancelEdits();
      this.cancelNewTodoTask();
      this.isShowDeleteWindow = true;
    },
    hideDeleteWindow() {
      this.isShowDeleteWindow = false;
    },
    deleteTodo() {
      // check if current screen size is for small devices
      if (this.screenSize <= 768) {
        this.isMobileView = true;
      }

      // dispatch an action to delete a todo from the list of todos
      this.$store.dispatch("todos/deleteTodo", {
        id: this.parentTodoId,
        firestoreDocId: this.firestoreDocId,
        isDefault: this.selectedTodo.isDefault,
        isMobileView: this.isMobileView,
        db: db,
        doc: _doc,
        deleteDoc: _deleteDoc,
      });

      // emit an event to show notification message
      let message = "Todo deleted successfully （╯°□°）╯︵";
      this.$emit("show-notification", message);

      // reset props
      this.hasTodo = false;
    },
    deleteTodoTask(index) {
      // dispatch an action to delete a task from a todo
      this.$store.dispatch({
        type: "todos/deleteTodoTask",
        parentTodoId: this.parentTodoId,
        childTodoId: index,
        firestoreDocId: this.firestoreDocId,
        db: db,
        doc: _doc,
        updateDoc: _updateDoc,
        arrayRemove: _arrayRemove,
      });

      // close any open edit fields
      this.cancelEdits();
    },
    setTextBasedOnFontSize(text) {
      let trimmedText = "";

      switch (this.globalFontSize) {
        case 14: // for 14px set a 20 character length limit
          trimmedText = this.setTextLength(text, 20);
          break;
        case 16: // 16px set a 15 character length limit
          trimmedText = this.setTextLength(text, 15);
          break;
        case 18: // 18px set a 10 character length limit
          trimmedText = this.setTextLength(text, 10);
          break;
        default:
          trimmedText = this.setTextLength(text, 20);
          break;
      }

      return trimmedText;
    },
    resetSelectedTodo() {
      // dispatch an action to reset the 'selectedTodo' state prop
      this.$store.dispatch("todos/resetSelectedTodo");
    },
  },
  watch: {
    selectedTodo(newTodo) {
      if (newTodo) {
        this.hasSwitchedTodos = true;
        this.hasTodo = true;
        this.parentTodoId = newTodo.id;
        this.firestoreDocId = newTodo.fireId; // firestore document ID

        // emit the id of the selectedTodo
        this.$emit("selectedtodo-id", this.parentTodoId);

        // reset props
        this.cancelEdits();
        this.cancelNewTodoTask();
        this.hideDeleteWindow();
      } else {
        this.hasTodo = false;
      }
    },
    isEditText(newValue) {
      if (!newValue) {
        this.isHighlighted = false;
      }
    },
    isCloseOpenFields(newValue) {
      if (newValue) {
        this.cancelEdits();
        this.cancelNewTodoTask();
      }
    },
  },
  beforeMount() {
    // dispatch an action to set the greeting
    this.$store.dispatch("setGreeting");
  },
  mounted() {
    // dispatch an action to reset the 'selectedTodo' state prop
    this.$store.dispatch("todos/resetSelectedTodo");
  },
  beforeUpdate() {
    const todo = this.$store.getters["todos/selectedTodo"];
    if (!todo) return;

    let numOfItems = todo.contents.length;
    let completedItems = todo.contents.filter((item) => item.isCompleted);

    // dispatch an action to set the open todo id
    this.$store.dispatch("todos/setOpenTodoId", todo.id);

    // check if there are any completed todo items
    if (completedItems.length < 1) {
      this.hasCompletedItems = false;
      this.progress = 0;
      return;
    }

    this.numOfCompletedItems = completedItems.length;
    this.hasCompletedItems = true;

    // calculate the progress
    this.progress = this.setProgress(numOfItems, this.numOfCompletedItems);
  },
  updated() {
    // scroll the item selected for edit into view
    if (this.isEditText) {
      let itemSelectedForEdit = document.querySelector(
        `.incomplete-items .items li:nth-child(${this.selectedItem + 1})`
      );
      itemSelectedForEdit.scrollIntoView();
    }

    // scroll a newly created todo task into view and animate it
    if (this.isCreated) {
      let newTodoEl = document.querySelector(
        ".incomplete-items .items li:last-child"
      );

      newTodoEl.scrollIntoView();
      newTodoEl.className = "animated flash";

      // remove the animation classes
      setTimeout(() => {
        newTodoEl.className = "";
      }, 1500);

      // reset props
      this.isCreated = false;
      return;
    }

    // scroll to the top when switching between different todos
    if (this.hasSwitchedTodos && this.selectedTodo) {
      document.querySelector(".details-wrapper").scrollTo(0, 0);

      // reset props
      this.hasSwitchedTodos = false;
    }
  },
};
</script>

<style scoped>
.progress-bar {
  position: relative;
  gap: 10px;
  margin-top: 0.625rem;
}

.progress-bar span {
  display: inline-block;
}

.progress-bar .bar-wrapper {
  width: 100%;
  height: 0.6em;
  border-radius: 50px;
  overflow: hidden;
}

.default-theme .progress-bar .bar-wrapper {
  background-color: var(--color-clouds);
}

.purplish-theme .progress-bar .bar-wrapper {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .progress-bar .bar-wrapper {
  background-color: var(--color-midnight-blue);
}

.progress-bar .bar-wrapper .bar {
  height: 0.7em;
  transition: width 0.4s ease-in-out;
}

.default-theme .progress-bar .bar-wrapper .bar {
  background-color: var(--color-dark-pastel-green);
}

.purplish-theme .progress-bar .bar-wrapper .bar {
  background-color: var(--color-tickle-me-pink);
}

.bluetiful-theme .progress-bar .bar-wrapper .bar {
  background-color: var(--color-maximum-blue-green);
}

.heading-wrapper .contents-info {
  position: absolute;
  bottom: -10px;
}

.items {
  margin-top: 0.25rem;
}

.items.completed {
  margin-top: 1.125rem;
}

.items .item {
  padding-top: 3px;
  margin-bottom: 5px;
  width: 100%;
}

.default-theme .item:hover {
  background-color: var(--color-honeydew);
}

.purplish-theme .item:hover {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .item:hover {
  background-color: var(--color-midnight-blue);
}

.items li.animated {
  -webkit-animation-duration: 1.5s;
  animation-duration: 1.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.default-theme .items li.flash {
  animation-name: flash;
}

.purplish-theme .items li.flash {
  animation-name: flashPurplish;
}

.bluetiful-theme .items li.flash {
  animation-name: flashBluetifully;
}

@keyframes flash {
  0%,
  50% {
    background-color: var(--color-light-green);
  }
  25%,
  75% {
    background: transparent;
  }
  100% {
    background: transparent;
  }
}

@keyframes flashPurplish {
  0%,
  50% {
    background-color: var(--color-tickle-me-pink);
  }
  25%,
  75% {
    background: transparent;
  }
  100% {
    background: transparent;
  }
}

@keyframes flashBluetifully {
  0%,
  50% {
    background-color: var(--color-midnight-blue);
  }
  25%,
  75% {
    background: transparent;
  }
  100% {
    background: transparent;
  }
}

.items .item .item-checkbox {
  height: fit-content;
}

.items .item .item-checkbox input[type="checkbox"] {
  display: grid;
  place-content: center;
  margin: 0;
  width: 1.1em;
  height: 1.1em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  -webkit-appearance: none;
  appearance: none;
  font: inherit;
  color: currentColor;
  transform: translateY(-0.075em);
  cursor: pointer;
}

.default-theme .items .item .item-checkbox input[type="checkbox"] {
  background-color: var(--color-white);
}

.bluetiful-theme .items .item .item-checkbox input[type="checkbox"],
.purplish-theme .items .item .item-checkbox input[type="checkbox"] {
  background-color: transparent;
}
.bluetiful-theme .items .item .item-checkbox input[type="checkbox"] {
  border: 0.15em solid var(--color-maximum-blue-green);
}

.items .item .item-checkbox input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.default-theme .items .item .item-checkbox input[type="checkbox"]::before {
  /* use box-shadow to color the tick inside the checkbox */
  box-shadow: inset 1em 1em var(--color-eerie-black);
}

.purplish-theme .items .item .item-checkbox input[type="checkbox"]::before {
  /* use box-shadow to color the tick inside the checkbox */
  box-shadow: inset 1em 1em var(--color-spanish-pink);
}

.bluetiful-theme .items .item .item-checkbox input[type="checkbox"]::before {
  /* use box-shadow to color the tick inside the checkbox */
  box-shadow: inset 1em 1em var(--color-maximum-blue-green);
}

.items .item .item-checkbox input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.default-theme .items .item .item-checkbox input[type="checkbox"]:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .items .item .item-checkbox input[type="checkbox"]:hover {
  background-color: var(--color-spanish-pink);
}

.bluetiful-theme .items .item .item-checkbox input[type="checkbox"]:hover {
  background-color: var(--color-maximum-blue-green);
}

.item-text-wrapper {
  width: 100%;
  margin: 0 0.75rem;
}

.item-text .item-details {
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  padding-bottom: 0.375rem;
  line-height: 1.2;
}

.item-text .item-details.completed {
  font-style: italic;
  text-decoration: line-through;
}

.default-theme .item-text .item-details.completed {
  color: var(--color-traffic-grey);
}

.purplish-theme .item-text .item-details.completed {
  color: var(--color-spanish-pink);
}

.bluetiful-theme .item-text .item-details.completed {
  color: var(--color-iron-gray);
}

.item-options .delete-item-btn {
  padding: 0.375rem 0.375rem 0.2rem !important;
  border-radius: 50px;
  opacity: 0;
  visibility: hidden;
}

.items .item:hover .item-options .delete-item-btn {
  opacity: 1;
  visibility: visible;
}

@media (max-width: 768px) {
  .item-options.visible .delete-item-btn {
    opacity: 1;
    visibility: visible;
  }
}

.default-theme .item-options .delete-item-btn:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .item-options .delete-item-btn:hover {
  background-color: var(--color-tickle-me-pink);
}

.purplish-theme .item-options .delete-item-btn:hover svg {
  stroke: var(--color-black-blue);
}

.bluetiful-theme .item-options .delete-item-btn:hover {
  background-color: var(--color-steel-blue);
}

.bluetiful-theme .item-options .delete-item-btn:hover svg {
  stroke: var(--color-lavender-gray);
}

.todo-creator-wrapper {
  position: relative;
  margin: 2rem auto 0;
  padding: 0 0.625rem;
  width: 90%;
  z-index: 2;
}

.item-edit-field {
  width: 100%;
}

.item-create-field .field,
.item-edit-field .field {
  padding: 0.5rem;
  width: 100%;
  height: auto;
  min-height: 3.125rem;
  border-radius: 5px;
  font-family: inherit;
  font-size: inherit;
  overflow-y: auto;
  overflow-wrap: break-word;
  resize: none;
}

.purplish-theme .item-create-field .field::placeholder {
  color: rgba(253, 199, 189, 0.8);
}

.bluetiful-theme .item-create-field .field::placeholder {
  color: rgba(198, 201, 205, 0.4);
}

.default-theme .item-create-field .field,
.default-theme .item-edit-field .field {
  border: 2px solid var(--color-dark-pastel-green);
  outline-color: var(--color-dark-pastel-green);
  background-color: var(--color-honeydew);
}

.purplish-theme .item-create-field .field,
.purplish-theme .item-edit-field .field {
  border: 2px solid var(--color-tickle-me-pink);
  outline-color: var(--color-tickle-me-pink);
  background-color: var(--color-russian-violet);
  color: var(--color-spanish-pink);
}

.bluetiful-theme .item-create-field .field,
.bluetiful-theme .item-edit-field .field {
  border: 2px solid var(--color-maximum-blue-green);
  outline-color: var(--color-maximum-blue-green);
  background-color: var(--color-midnight-blue);
  color: var(--color-lavender-gray);
}

.item-create-field .create-controls,
.item-edit-field .edit-controls {
  margin-top: 0.375rem;
}

.default-theme .item-create-btn .btn.btn-add,
.default-theme .item-create-field .create-controls .btn.btn-add,
.default-theme .item-edit-field .edit-controls .btn.btn-save {
  background-color: var(--color-malachite);
}

.purplish-theme .item-create-field .create-controls .btn.btn-add,
.purplish-theme .item-edit-field .edit-controls .btn.btn-save,
.purplish-theme .item-create-btn .btn.btn-add {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.bluetiful-theme .item-create-field .create-controls .btn.btn-add,
.bluetiful-theme .item-edit-field .edit-controls .btn.btn-save,
.bluetiful-theme .item-create-btn .btn.btn-add {
  background-color: var(--color-maximum-blue-green);
  color: var(--color-black-blue);
}

.default-theme .item-create-btn .btn.btn-add:hover,
.default-theme .item-create-field .create-controls .btn.btn-add:hover,
.default-theme .item-edit-field .edit-controls .btn.btn-save:hover {
  background-color: var(--color-light-green);
}

.purplish-theme .item-create-field .create-controls .btn.btn-add:hover,
.purplish-theme .item-edit-field .edit-controls .btn.btn-save:hover,
.purplish-theme .item-create-btn .btn.btn-add:hover {
  background-color: var(--color-spanish-pink);
}

.bluetiful-theme .item-create-field .create-controls .btn.btn-add:hover,
.bluetiful-theme .item-edit-field .edit-controls .btn.btn-save:hover,
.bluetiful-theme .item-create-btn .btn.btn-add:hover {
  background-color: var(--color-lavender-gray);
}

.top-controls .delete-todo-btn,
.item-create-btn .btn.btn-cancel,
.item-create-field .create-controls .btn.btn-cancel,
.item-edit-field .edit-controls .btn.btn-cancel {
  margin-left: 0.3125rem;
}

.default-theme .hide-btn:hover,
.default-theme .item-create-btn .btn.btn-cancel:hover,
.default-theme .item-create-field .create-controls .btn.btn-cancel:hover,
.default-theme .item-edit-field .edit-controls .btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .item-create-btn .btn.btn-cancel:hover,
.purplish-theme .item-edit-field .edit-controls .btn.btn-cancel:hover {
  background-color: var(--color-black-blue);
}

.purplish-theme .item-create-field .create-controls .btn.btn-cancel:hover,
.purplish-theme .hide-btn:hover {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .item-create-btn .btn.btn-cancel:hover,
.bluetiful-theme .item-edit-field .edit-controls .btn.btn-cancel:hover {
  background-color: var(--color-midnight-blue);
}

.bluetiful-theme .item-create-field .create-controls .btn.btn-cancel:hover,
.bluetiful-theme .hide-btn:hover {
  background-color: var(--color-midnight-blue);
  color: var(--color-lavender-gray);
}
</style>