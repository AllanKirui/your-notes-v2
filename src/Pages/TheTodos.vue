<template>
  <section class="content-wrapper">
    <section class="content-items">
      <h3 class="items-title">All Todos</h3>
      <todo-list></todo-list>
    </section>

    <section class="content-items-details">
      <div class="bg-images"></div>
      <todo-details></todo-details>
    </section>

    <!-- use the transition component to animate the modal -->
    <transition name="modal">
      <div class="modal-wrapper" v-if="isModal" @click="closeModal">
        <!-- stop the event propagation from clicking on the modal backdrop -->
        <base-card @click.stop>
          <div class="modal-container">
            <h3 class="modal-title">Add a New Todo</h3>

            <form class="modal-form" @submit.prevent="addNewTodo">
              <div class="input-wrapper">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  ref="title"
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
  </section>
</template>

<script>
import TodoList from "@/components/todos/TodoList.vue";
import TodoDetails from "@/components/todos/TodoDetails.vue";

export default {
  props: ["isModal"],
  emits: ["close-modal"],
  components: {
    TodoList,
    TodoDetails,
  },
  computed: {
    numOfTodos() {
      return this.$store.getters["todos/numOfTodos"];
    },
  },
  methods: {
    setTodoTextLength(todoText, size) {
      if (todoText.length <= size) return todoText;

      let shortText = "";
      for (let i = 0; i <= size; i++) {
        shortText += todoText[i];
      }
      return shortText + "...";
    },
    closeModal() {
      this.$emit("close-modal");

      // dispatch an action to reset the isCloseOpenField state prop
      this.$store.dispatch("todos/closeOpenFields", false);
    },
    addNewTodo() {
      let todoTitle = this.$refs.title.value.trim();
      let todoTask = this.$refs.newTodo.value.trim();
      let newTodo = {
        id: this.numOfTodos,
        title: todoTitle,
        contents: [],
        isHideCompleted: false,
      };

      // add the new task to the contents list
      newTodo.contents.push({ text: todoTask, isCompleted: false });

      // dispatch an action to add the new todo to the todos list
      this.$store.dispatch("todos/addNewTodo", newTodo);

      // close new todo modal
      this.closeModal();

      // open the newly created todo
      this.openNewTodo(newTodo.id);

      // TODO: show success notification
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
  },
  provide() {
    return {
      setTodoTextLength: this.setTodoTextLength,
    };
  },
};
</script>

<style scoped>
.content-wrapper {
  display: grid;
  grid-template-columns: minmax(auto, 350px) minmax(350px, 1fr);
  grid-template-rows: 1fr;
  color: var(--color-eerie-black);
  width: 100%;
  height: calc(100vh - 80px);
  overflow: hidden;
  position: relative;
}

.content-items {
  background-color: var(--color-cultured);
  border-right: 1px solid var(--color-platinum);
  overflow-y: auto;
}

.content-items-details {
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  background: var(--color-white);
  overflow-y: auto;
}

.content-items-details .bg-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/img/text-bg.svg"),
    url("@/assets/img/quill-bg.svg");
  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed, fixed;
  background-size: 88px, 190px;
  background-position: 630px center, calc(50vw + 200px) center;
  z-index: 1;
}

.items-title {
  font-size: 1.125rem;
  padding: 0.625rem;
}

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
  font-size: 1.125rem;
  text-align: center;
}

.modal-form {
  margin-top: 1rem;
}

.modal-form .input-wrapper {
  position: relative;
  width: 100%;
  font-size: 0.875rem;
  color: var(--color-eerie-black);
}

.modal-form .input-wrapper input {
  width: 100%;
  padding: 0.625rem;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
}

.modal-form .input-wrapper textarea::placeholder,
.modal-form .input-wrapper input::placeholder {
  color: var(--color-traffic-grey);
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
}

.modal-form .create-controls {
  margin-top: 1rem;
}

.modal-form .create-controls .btn.btn-cancel {
  margin-left: 0.3125rem;
}

.modal-form .create-controls .btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}

.modal-form .create-controls .btn.btn-add {
  background-color: var(--color-malachite);
}

.modal-form .create-controls .btn.btn-add:hover {
  background-color: var(--color-light-green);
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
</style>