<template>
  <li
    :class="[selectedTodoId === id ? 'active' : '', 'item-wrapper flex']"
    @click="setSelectedTodo(id)"
    :title="hoverTitle"
  >
    <div class="indicator">
      <span class="active"></span>
    </div>

    <div class="text-wrapper">
      <div class="title-wrapper flex flex-jc-sb">
        <h4 class="item-title">{{ title }}</h4>
        <span class="item-status">{{ status }}</span>
      </div>
      <ul class="item-list">
        <!-- Get the first 3 items of the contents -->
        <li class="item flex flex-ai-c" v-for="(_, index) in 3" :key="index">
          <img
            v-if="displayContent[index]"
            src="@/assets/img/checkbox-grey.svg"
            alt=" "
            width="14"
          />
          <!-- Only show incomplete tasks   -->
          <span>
            {{
              displayContent[index]
                ? displayContent[index].text
                : displayContent[index]
            }}
          </span>
        </li>
      </ul>
      <!-- Only show If all tasks in a todo are complete   -->
      <p class="completion-message" v-if="!displayContent.length">
        Woohoo! All tasks in this todo are done.
      </p>
    </div>
  </li>
</template>

<script>
export default {
  props: ["id", "title", "contents"],
  data() {
    return {
      selectedTodoId: null,
    };
  },
  computed: {
    hoverTitle() {
      return "View " + this.title;
    },
    displayContent() {
      // return items which are not marked as complete
      return this.contents.filter((item) => !item.isCompleted);
    },
    selectedTodo() {
      return this.$store.getters["todos/selectedTodo"];
    },
    status() {
      // return items which are checked over the total items
      return (
        this.contents.filter((item) => item.isCompleted).length +
        "/" +
        this.contents.length
      );
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
  watch: {
    selectedTodo(newValue) {
      if (newValue) {
        this.selectedTodoId = newValue.id;
      }
    },
  },
};
</script>

<style scoped>
.item-wrapper {
  gap: 10px;
  padding: 0.5rem;
  outline: 1px solid var(--color-clouds);
  cursor: pointer;
}

.item-wrapper:hover {
  background-color: var(--color-clouds);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.item-wrapper.active {
  background-color: var(--color-white);
}

.item-wrapper.active .indicator span.active {
  display: inline-block;
  width: 0.375rem;
  height: 100%;
  border-radius: 10px;
  background: rgb(0, 224, 60);
  background: linear-gradient(
    0deg,
    rgba(0, 168, 45, 1) 0%,
    rgba(0, 224, 60, 1) 100%
  );
}

.text-wrapper {
  width: 100%;
}

.completion-message,
.item-list,
.text-wrapper {
  font-size: 0.875rem;
}

.title-wrapper {
  width: 100%;
}

.item-status {
  font-weight: 500;
}

.item-list {
  margin-top: 0.5rem;
}

.item:not(:first-child) {
  margin-top: 3px;
}

.item span {
  margin-left: 0.5rem;
}
</style>