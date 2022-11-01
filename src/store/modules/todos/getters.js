export default {
  todoList(state) {
    return state.todos;
  },
  selectedTodo(state) {
    return state.selectedTodo;
  },
  numOfTodos(state) {
    return state.todos.length;
  },
  isCloseOpenFields(state) {
    return state.isCloseOpenFields;
  },
  openTodoId(state) {
    return state.openTodoId;
  },
  hasUpdatedTodoTask(state) {
    return state.hasUpdatedTodoTask;
  },
};
