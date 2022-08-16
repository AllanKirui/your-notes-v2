<template>
  <div v-if="!hasTodo" class="intro-wrapper">
    <h3 class="intro-title">{{ greeting }}</h3>
    <p class="intro-message-1">
      Please select a todo from the <b>All Todos</b> panel to continue working
      on an existing todo
    </p>
    <p class="intro-message-2">
      Or click the <b>Create New Todo</b> button on the sidebar to create a new
      todo
    </p>
  </div>

  <!-- Todo title and progress bar -->
  <div v-if="hasTodo" class="heading-wrapper">
    <div class="heading-top flex">
      <h3 class="items-title">{{ selectedTodo.title }}</h3>
      <div class="top-controls">
        <button
          v-if="hasCompletedItems"
          @click="toggleCompletedItems"
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
        <base-card>
          <div class="confirm-delete-title flex flex-ai-c flex-jc-sb">
            <span class="title"
              >Delete {{ setTextLength(selectedTodo.title, 20) }}</span
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

            <div class="item-options">
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
      <hr />
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
        @input="$nextTick(autoResizeCreateField)"
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

export default {
  emits: ["show-notification"],
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
    };
  },
  computed: {
    ...mapGetters("todos", ["selectedTodo", "isCloseOpenFields"]),
    ...mapGetters(["greeting"]),
    completedItemsFieldText() {
      return this.numOfCompletedItems > 1
        ? `${this.numOfCompletedItems} Completed items`
        : `${this.numOfCompletedItems} Completed item`;
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
    autoResizeCreateField() {
      let textarea = this.$refs.newTask;
      textarea.style.height = textarea.scrollHeight + "px";
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
          parentTodoId: this.parentTodoId,
          newTask: newTask,
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
    toggleCompletedItems() {
      // dispatch an action to set hidden status of completed tasks in a todo
      this.$store.dispatch({
        type: "todos/updateHiddenStatus",
        parentTodoId: this.parentTodoId,
      });
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
      // dispatch an action to delete a todo from the list of todos
      this.$store.dispatch("todos/deleteTodo", this.parentTodoId);

      // emit an event to show notification message
      let message = "Todo deleted successfully";
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
      });

      // close any open edit fields
      this.cancelEdits();
    },
  },
  watch: {
    selectedTodo(newTodo) {
      if (newTodo) {
        this.hasSwitchedTodos = true;
        this.hasTodo = true;
        this.parentTodoId = newTodo.id;

        // reset props
        this.cancelEdits();
        this.cancelNewTodoTask();
        this.hideDeleteWindow();
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

    // scroll a newly created todo into view and animate it
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
    if (this.hasSwitchedTodos) {
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

.progress-bar .percentage {
  font-size: 0.875rem;
}

.progress-bar .bar-wrapper {
  background-color: var(--color-clouds);
  width: 100%;
  height: 0.6em;
  border-radius: 50px;
  overflow: hidden;
}

.progress-bar .bar-wrapper .bar {
  height: 0.7em;
  background-color: var(--color-dark-pastel-green);
  transition: width 0.4s ease-in-out;
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

.items .item:hover {
  background-color: var(--color-honeydew);
}

.items li.animated {
  -webkit-animation-duration: 1.5s;
  animation-duration: 1.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.items li.flash {
  animation-name: flash;
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
  background-color: var(--color-white);
  font: inherit;
  color: currentColor;
  transform: translateY(-0.075em);
  cursor: pointer;
}

.items .item .item-checkbox input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--color-eerie-black);
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.items .item .item-checkbox input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.items .item .item-checkbox input[type="checkbox"]:hover {
  background-color: var(--color-platinum);
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
  color: var(--color-traffic-grey);
}

.item-options .delete-item-btn {
  padding: 0.375rem 0.375rem 0.2rem !important;
  border-radius: 50px;
  opacity: 0;
  visibility: visible;
}

.items .item:hover .item-options .delete-item-btn {
  opacity: 1;
  visibility: visible;
}

.item-options .delete-item-btn:hover {
  background-color: var(--color-platinum);
}

.todo-creator-wrapper {
  position: relative;
  margin: 2rem auto 0;
  padding: 0 0.625rem 0;
  width: 90%;
  font-size: 0.875rem;
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
  border: 2px solid var(--color-dark-pastel-green);
  outline-color: var(--color-dark-pastel-green);
  font-family: inherit;
  font-size: inherit;
  background-color: var(--color-honeydew);
  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
}

.item-create-field .create-controls,
.item-edit-field .edit-controls {
  margin-top: 0.375rem;
}

.item-create-btn .btn.btn-add,
.item-create-field .create-controls .btn.btn-add,
.item-edit-field .edit-controls .btn.btn-save {
  background-color: var(--color-malachite);
}

.item-create-btn .btn.btn-add:hover,
.item-create-field .create-controls .btn.btn-add:hover,
.item-edit-field .edit-controls .btn.btn-save:hover {
  background-color: var(--color-light-green);
}

.top-controls .delete-todo-btn,
.item-create-btn .btn.btn-cancel,
.item-create-field .create-controls .btn.btn-cancel,
.item-edit-field .edit-controls .btn.btn-cancel {
  margin-left: 0.3125rem;
}

.hide-btn:hover,
.item-create-btn .btn.btn-cancel:hover,
.item-create-field .create-controls .btn.btn-cancel:hover,
.item-edit-field .edit-controls .btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}
</style>