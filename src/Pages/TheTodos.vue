<template>
  <section class="content-wrapper">
    <div v-if="!numOfTodos" class="content-intro-wrapper">
      <div class="bg-images"></div>
      <div class="text">
        <h3 class="intro-title">{{ greeting }}</h3>
        <p class="intro-message-1">
          Please click on the <b>Create New Todo</b> button on the sidebar to
          create a new todo
        </p>
      </div>
    </div>

    <section class="content-items" v-if="numOfTodos">
      <h3 class="items-title">Todos</h3>
      <todo-list></todo-list>
    </section>

    <section class="content-items-details" v-if="numOfTodos">
      <div class="bg-images"></div>
      <todo-details @show-notification="showNotification"></todo-details>
    </section>

    <!-- use the transition component to animate the modal -->
    <transition name="modal">
      <div
        class="modal-wrapper"
        v-if="isModal && activeSide === 'New Todo'"
        @click="closeModal"
      >
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
  props: ["isModal", "activeSide"],
  emits: ["close-modal", "show-notification"],
  components: {
    TodoList,
    TodoDetails,
  },
  computed: {
    numOfTodos() {
      return this.$store.getters["todos/numOfTodos"];
    },
    greeting() {
      return this.$store.getters.greeting;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");

      // dispatch an action to reset the isCloseOpenField state prop
      this.$store.dispatch("todos/closeOpenFields", false);
    },
    addNewTodo() {
      let todoTitle = this.$refs.title.value.trim();
      let todoTask = this.$refs.newTodo.value.trim();

      // show notification if the title or task field is empty
      if (!todoTitle || !todoTask) {
        let message = "Please provide a title and one todo task";
        this.showNotification(message);
        return;
      }

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

      // show success notification
      let message = "Added todo successfully";
      this.showNotification(message);
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
};
</script>