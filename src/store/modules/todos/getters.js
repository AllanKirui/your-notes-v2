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
};
