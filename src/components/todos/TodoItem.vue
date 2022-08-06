<template>
  <li
    :class="[openTodoId === id ? 'active' : '', 'item-wrapper flex']"
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
          <!-- only show image for incomplete tasks on a todo -->
          <img
            v-if="displayContent[index]"
            src="@/assets/img/checkbox-grey.svg"
            alt=" "
            width="14"
          />
          <span>{{ setTodoItemText(index) }}</span>
        </li>
      </ul>
      <!-- Only show if all tasks in a todo are complete   -->
      <p
        class="completion-message"
        v-if="!displayContent.length && contents.length"
      >
        Woohoo! All tasks in this todo are done.
      </p>
      <!-- Only show if there are no tasks in a todo   -->
      <p
        class="completion-message"
        v-if="!displayContent.length && !contents.length"
      >
        This todo is empty.
      </p>
    </div>
  </li>
</template>

<script>
export default {
  props: ["id", "title", "contents"],
  inject: ["setTodoTextLength"],
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
    openTodoId() {
      return this.$store.getters["todos/openTodoId"];
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
    setTodoItemText(index) {
      let incompleteItems = this.contents.filter((item) => !item.isCompleted);
      // show incomplete tasks if available, show an empty list if there are no more items in the list
      // show a maximum of 35 characters for the todo item text
      let itemText = incompleteItems[index]
        ? this.setTodoTextLength(incompleteItems[index].text, 35)
        : incompleteItems[index];

      return itemText;
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