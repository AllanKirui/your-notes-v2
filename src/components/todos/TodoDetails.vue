<template>
  <div v-if="hasTodo" class="details-wrapper">
    <h3>{{ selectedTodo.title }}</h3>
    <ul>
      <li v-for="(item, index) of selectedTodo.contents" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      hasTodo: false,
    };
  },
  computed: {
    ...mapGetters("todos", ["selectedTodo"]),
  },
  watch: {
    selectedTodo(newValue) {
      if (newValue) {
        this.hasTodo = true;
      }
    },
  },
};
</script>