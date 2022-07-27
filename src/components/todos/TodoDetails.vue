<template>
  <!-- Todo title and progress bar -->
  <div v-if="hasTodo" class="heading-wrapper">
    <h3 class="items-title">{{ selectedTodo.title }}</h3>
    <div class="progress-bar flex flex-ai-c">
      <span class="percentage">{{ progress }}%</span>
      <div class="bar-wrapper flex flex-ai-c">
        <span class="bar" :style="{ width: progress + '%' }"></span>
      </div>
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
                  ref="textarea"
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
          </div>
        </li>
      </ul>
    </div>

    <!-- list of completed items -->
    <div class="completed-items" v-if="hasCompletedItems">
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

  <!-- field to create a new todo -->
  <div v-if="hasTodo" class="todo-creator-wrapper">
    <div class="item-create-btn" v-if="!isCreateNewTodo">
      <button
        class="btn btn-add"
        title="Add new todo"
        @click="showNewTodoField"
      >
        Add new todo
      </button>
    </div>

    <div class="item-create-field" v-if="isCreateNewTodo">
      <textarea
        class="field"
        type="text"
        ref="newTodo"
        placeholder="Add new todo"
        @input="$nextTick(autoResizeCreateField)"
      ></textarea>
      <div class="create-controls">
        <button class="btn btn-add" title="Add new todo" @click="addNewTodo">
          Add new todo
        </button>
        <button class="btn btn-cancel" title="Cancel" @click="cancelNewTodo">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      hasTodo: false,
      isEditText: false,
      selectedItem: null,
      isChecked: false,
      parentTodoId: null,
      isCreateNewTodo: false,
      isCreated: false,
      hasSwitchedTodos: false,
      hasCompletedItems: false,
      numOfCompletedItems: 0,
      progress: 0,
      isHighlighted: false,
    };
  },
  computed: {
    ...mapGetters("todos", ["selectedTodo"]),
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
      // don't open edit field if todo is marked as completed
      if (this.selectedTodo.contents[index].isCompleted) return;
      // close the create new todo field if it's open
      if (this.isCreateNewTodo) this.cancelNewTodo();

      this.selectedItem = index;
      this.isEditText = true;

      // resize the textarea after it has been rendered
      this.$nextTick(() => {
        this.autoResizeEditField();
      });
    },
    autoResizeEditField() {
      let textarea = this.$refs.textarea[0];
      textarea.style.height = textarea.scrollHeight + "px";

      // if the textarea is already focused and selected, return
      if (this.isHighlighted) return;

      // focus on the textarea and highlight its contents
      textarea.focus();
      textarea.select();
      this.isHighlighted = true;
    },
    autoResizeCreateField() {
      let textarea = this.$refs.newTodo;
      textarea.style.height = textarea.scrollHeight + "px";
    },
    cancelEdits() {
      // reset props
      this.selectedItem = null;
      this.isEditText = false;
    },
    checkHandler(index, isCompleted) {
      // close the create new todo field if it's open
      if (this.isCreateNewTodo) this.cancelNewTodo();
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
      let updatedText = this.$refs.textarea[0].value;

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
    showNewTodoField() {
      // close the edit todo field if it's open
      this.cancelEdits();
      this.isCreateNewTodo = true;

      // focus on the create new todo textarea after it's shown
      this.$nextTick(() => {
        this.$refs.newTodo.focus();
      });
    },
    cancelNewTodo() {
      // reset props
      this.isCreateNewTodo = false;
    },
    addNewTodo() {
      // close the edit todo field if it's open
      if (this.isEditText) this.cancelEdits();
      this.isCreated = false;

      let newTodo = this.$refs.newTodo.value.trim();

      // dispatch an action to add a new todo item
      if (newTodo) {
        this.$store.dispatch({
          type: "todos/addNewTodo",
          parentTodoId: this.parentTodoId,
          newTodo: newTodo,
        });
      }
      this.isCreated = true;

      // clear the field and re-focus on it
      this.$refs.newTodo.value = "";
      this.$refs.newTodo.focus();
    },
    setProgress(totalItems, completed) {
      return Math.round((completed / totalItems) * 100);
    },
  },
  watch: {
    selectedTodo(newTodo) {
      if (newTodo) {
        this.hasSwitchedTodos = true;
        this.hasTodo = true;
        this.parentTodoId = newTodo.id;

        // reset props
        this.selectedItem = null;
        this.isCreateNewTodo = false;
      }
    },
    isEditText(newValue) {
      if (!newValue) {
        this.isHighlighted = false;
      }
    },
  },
  mounted() {
    // dispatch an action to reset the 'selectedTodo' state prop
    this.$store.dispatch("todos/resetSelectedTodo");
  },
  beforeUpdate() {
    const todos = this.$store.getters["todos/selectedTodo"];
    let numOfItems = todos.contents.length;
    let completedItems = todos.contents.filter((item) => item.isCompleted);

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
.details-wrapper,
.heading-wrapper {
  position: relative;
  margin: 2.5rem auto 0;
  padding: 0 0.625rem 1rem;
  width: 90%;
  z-index: 2;
}

.details-wrapper {
  margin: 0 auto;
  height: calc(100vh - 330px);
  font-size: 0.875rem;
  overflow-y: auto;
}

.heading-wrapper .progress-bar {
  position: relative;
  gap: 10px;
  margin-top: 10px;
}

.heading-wrapper .progress-bar span {
  display: inline-block;
}

.heading-wrapper .progress-bar .percentage {
  font-size: 0.875rem;
}

.heading-wrapper .progress-bar .bar-wrapper {
  background-color: var(--color-clouds);
  width: 100%;
  height: 0.6em;
  border-radius: 50px;
  overflow: hidden;
}

.heading-wrapper .progress-bar .bar-wrapper .bar {
  height: 0.7em;
  background-color: var(--color-dark-pastel-green);
  transition: width 0.4s ease-in-out;
}

.items {
  margin-top: 0.25rem;
}

.items.completed {
  margin-top: 1.125rem;
}

.items .item {
  margin-bottom: 0.5rem;
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

.item-create-btn .btn,
.item-create-field .create-controls .btn,
.item-edit-field .edit-controls .btn {
  padding: 0.375rem 0.5rem;
  background: transparent;
  border: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.item-create-btn .btn.btn-add,
.item-create-field .create-controls .btn.btn-add,
.item-edit-field .edit-controls .btn.btn-save {
  background-color: var(--color-malachite);
  transition: all 0.15s ease-in-out;
}

.item-create-btn .btn.btn-add:hover,
.item-create-field .create-controls .btn.btn-add:hover,
.item-edit-field .edit-controls .btn.btn-save:hover {
  background-color: var(--color-light-green);
}

.item-create-btn .btn.btn-cancel,
.item-create-field .create-controls .btn.btn-cancel,
.item-edit-field .edit-controls .btn.btn-cancel {
  margin-left: 0.3125px;
  transition: all 0.15s ease-in-out;
}

.item-create-btn .btn.btn-cancel:hover,
.item-create-field .create-controls .btn.btn-cancel:hover,
.item-edit-field .edit-controls .btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}
</style>