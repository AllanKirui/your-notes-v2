<template>
  <!-- TODO: only show this if there are todos -->
  <ul>
    <todo-item
      v-for="todo of todoList"
      :key="todo.id"
      :title="todo.title"
      :contents="todo.contents"
    ></todo-item>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

import TodoItem from "@/components/todos/TodoItem.vue";

export default {
  components: {
    TodoItem,
  },
  computed: {
    // tap into the 'todos' module and get the 'todoList' from the store
    ...mapGetters("todos", ["todoList"]),
  },
};
</script>