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
  </section>
</template>

<script>
import TodoList from "@/components/todos/TodoList.vue";
import TodoDetails from "@/components/todos/TodoDetails.vue";

export default {
  components: {
    TodoList,
    TodoDetails,
  },
};
</script>

<style scoped>
.content-wrapper {
  display: grid;
  grid-template-columns: minmax(auto, 350px) minmax(350px, 1fr);
  grid-template-rows: 1fr;
  color: var(--color-eerie-black);
  height: calc(100vh - 80px);
  overflow: hidden;
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
</style>