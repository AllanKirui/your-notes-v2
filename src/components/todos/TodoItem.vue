<template>
  <li class="item-wrapper" @click="setSelectedTodo(id)" :title="hoverTitle">
    <h4 class="item-title">{{ title }}</h4>
    <ul class="item-list">
      <!-- Get the first 3 items of the contents -->
      <li class="item flex flex-ai-c" v-for="(_, index) in 3" :key="index">
        <img src="@/assets/img/checkbox-grey.svg" alt=" " width="14" />
        <span> {{ contents[index] }} </span>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: ["id", "title", "contents"],
  computed: {
    hoverTitle() {
      return "View " + this.title;
    },
  },
  methods: {
    setSelectedTodo(id) {
      // dispatch an action to set the id of the selected todo item
      this.$store.dispatch({
        type: "todos/setSelectedTodo",
        todoId: id,
      });
    },
  },
};
</script>

<style scoped>
.item-wrapper {
  padding: 0.5rem;
  outline: 1px solid var(--color-platinum);
  cursor: pointer;
}

.item-wrapper.active {
  border-left: 2px solid tomato;
}

/* .item-wrapper.inactive {
  border-left: none;
} */

.item-list,
.item-title {
  font-size: 0.875rem;
}

.item-list {
  margin-top: 0.5rem;
}

.item:not(:first-child) {
  margin-top: 2px;
}

.item span {
  margin-left: 0.5rem;
}
</style>