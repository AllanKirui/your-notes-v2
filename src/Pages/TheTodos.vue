<template>
  <section class="content-wrapper">
    <div class="content-items">
      <h3 class="items-title">All Todos</h3>
      <todo-list></todo-list>
    </div>
    <div class="content-items-details">
      <h3>Todo details</h3>
    </div>
  </section>
</template>

<script>
import TodoList from "@/components/todos/TodoList.vue";

export default {
  components: {
    TodoList,
  },
};
</script>

<style scoped>
.content-wrapper {
  display: grid;
  grid-template-columns: minmax(auto, 350px) minmax(350px, 1fr);
  grid-template-rows: 1fr;
}

.content-items {
  background-color: teal;
}

.content-items-details {
  background: tomato;
}
</style>