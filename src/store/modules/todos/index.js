import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      todos: [],
      selectedTodo: null,
      isCloseOpenFields: false,
      openTodoId: null,
      hasUpdatedTodoTask: false,
      welcomeTodo: {
        id: 0,
        title: "Welcome to Todos",
        contents: [
          {
            text: 'Add a new todo task by clicking the "Add new task" button below',
            isCompleted: false,
          },
          {
            text: "Edit a todo task by clicking on it to open the edit field",
            isCompleted: false,
          },
          {
            text: 'Delete a todo task by clicking the "X" (cross) at the end of the task',
            isCompleted: false,
          },
          {
            text: 'Create a new todo by clicking the "New Todo" button on the sidebar',
            isCompleted: false,
          },
          {
            text: 'Delete a todo by clicking the "Delete" button on top',
            isCompleted: false,
          },
          {
            text: "Please note: If you edit any task here, you can simply restore the defaults by refreshing the page",
            isCompleted: false,
          },
          {
            text: "However, if you choose to delete this Welcome Todo, you can restore it at any time from the Settings page",
            isCompleted: false,
          },
        ],
        isHideCompleted: false,
        isDefault: true,
        isHidden: false,
      },
    };
  },
  getters,
  mutations,
  actions,
};
