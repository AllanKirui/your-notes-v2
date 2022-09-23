<template>
  <li :class="todoClasses" @click="setSelectedTodo(id)" :title="hoverTitle">
    <div class="bg-image"></div>

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
            v-if="displayContent[index] && !theme"
            src="@/assets/img/checkbox-grey.svg"
            alt=" "
            width="14"
          />
          <img
            v-else-if="
              displayContent[index] && theme === 'purplish' && isDefault
            "
            src="@/assets/img/checkbox-black-blue.svg"
            alt=" "
            width="14"
          />
          <img
            v-else-if="displayContent[index] && theme === 'purplish'"
            src="@/assets/img/checkbox-purplish.svg"
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
  props: ["id", "title", "contents", "isDefault", "screenSize"],
  inject: ["setTextLength", "globalFontSize"],
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
    todoList() {
      return this.$store.getters["todos/todoList"];
    },
    openTodoId() {
      return this.$store.getters["todos/openTodoId"];
    },
    theme() {
      return this.$store.getters.theme;
    },
    status() {
      // return items which are checked over the total items
      return (
        this.contents.filter((item) => item.isCompleted).length +
        "/" +
        this.contents.length
      );
    },
    todoClasses() {
      let classes = "";

      // add a default class for the default todo item
      if (this.isDefault) {
        classes = "item-wrapper flex default-item";
      } else {
        classes = "item-wrapper flex";
      }

      // add the 'active' class for the opened todo item
      if (this.openTodoId === this.id) {
        classes += " active";
      }

      return classes;
    },
  },
  methods: {
    setSelectedTodo(id) {
      // dispatch an action to set the id of the selected todo item
      this.$store.dispatch({
        type: "todos/setSelectedTodo",
        todoId: id,
      });

      // get the selected todo element
      let [selectedTodo] = this.todoList.filter((todo) => todo.id === id);
      let index = this.todoList.indexOf(selectedTodo) + 1; // plus 1 since :nth-child() is not zero indexed
      let todoEl = document.querySelector(`.item-wrapper:nth-child(${index})`);

      // for the first 3 elements, scroll the parent's sibling into view
      if (index < 4) {
        let todosWrapperEl = document.querySelector(".todos-wrapper");
        let prevSibling = todosWrapperEl.previousElementSibling;
        prevSibling.scrollIntoView();
        return;
      }

      // for other elements, scroll selected todo item into view
      todoEl.scrollIntoView();
    },
    setTodoItemText(index) {
      let incompleteItems = this.contents.filter((item) => !item.isCompleted);
      // show incomplete tasks if available, show an empty list
      // if there are no more items in the list
      let itemText = incompleteItems[index]
        ? this.setTextBasedOnFontSize(incompleteItems, index)
        : incompleteItems[index];

      return itemText;
    },
    setTextBasedOnFontSize(incompleteItems, index) {
      let trimmedText = "";

      switch (this.globalFontSize) {
        case 14: // for 14px set a 40 character length limit, increase limit for screen less than 768px
          if (this.screenSize <= 768) {
            trimmedText = this.setTextLength(incompleteItems[index].text, 80);
          } else {
            trimmedText = this.setTextLength(incompleteItems[index].text, 40);
          }
          break;
        case 16: // 16px set a 35 character length limit, increase limit for screen less than 768px
          if (this.screenSize <= 768) {
            trimmedText = this.setTextLength(incompleteItems[index].text, 70);
          } else {
            trimmedText = this.setTextLength(incompleteItems[index].text, 35);
          }
          break;
        case 18: // 18px set a 30 character length limit, increase limit for screen less than 768px
          if (this.screenSize <= 768) {
            trimmedText = this.setTextLength(incompleteItems[index].text, 60);
          } else {
            trimmedText = this.setTextLength(incompleteItems[index].text, 30);
          }
          break;
        default:
          trimmedText = this.setTextLength(incompleteItems[index].text, 40);
          break;
      }

      return trimmedText;
    },
  },
};
</script>

<style scoped>
.item-status {
  font-weight: 500;
}

.item:not(:first-child) {
  margin-top: 3px;
}

.item span {
  margin-left: 0.5rem;
}
</style>