export default {
  setSelectedTodo(state, payload) {
    // get the todo whose id matches the payload id
    state.selectedTodo = state.todos.filter(
      (todo) => todo.id === payload.todoId
    )[0];
  },
  updateCompletionStatus(state, payload) {
    let parentIdx = payload.parentTodoId;
    let childIdx = payload.childTodoId;
    let status = payload.status;

    // update the 'isCompleted' prop
    state.todos[parentIdx].contents[childIdx].isCompleted = status;
  },
  saveChanges(state, payload) {
    let parentIdx = payload.parentTodoId;
    let childIdx = payload.childTodoId;

    // update the 'text' prop
    state.todos[parentIdx].contents[childIdx].text = payload.newText;
  },
  addNewTodo(state, payload) {
    let parentIdx = payload.parentTodoId;
    let newTodo = {
      text: payload.newTodo,
      isCompleted: false,
    };

    // add a new todo to the 'contents' list
    state.todos[parentIdx].contents.push(newTodo);
  },
};
