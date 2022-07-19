<template>
  <ul>
    <todo-item></todo-item>
  </ul>
</template>

<script>
import TodoItem from "@/components/todos/TodoItem.vue";

export default {
  components: {
    TodoItem,
  },
};
</script>