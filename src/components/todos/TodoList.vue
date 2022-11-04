<template>
  <ul class="todos-wrapper">
    <todo-item
      v-for="todo of todoList"
      :key="todo.id"
      :id="todo.id"
      :title="todo.title"
      :contents="todo.contents"
      :is-default="todo.isDefault"
      :screen-size="screenSize"
    ></todo-item>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

import TodoItem from "@/components/todos/TodoItem.vue";

export default {
  name: "TodoList",
  props: ["screenSize"],
  components: {
    TodoItem,
  },
  computed: {
    // tap into the 'todos' module and get the 'todoList' from the store
    ...mapGetters("todos", ["todoList"]),
  },
};
</script>