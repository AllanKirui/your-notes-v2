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
    // add a new todo to the list of todos
    state.todos.push(payload);
  },
  addNewTodoTask(state, payload) {
    let parentIdx = payload.parentTodoId;
    let newTask = {
      text: payload.newTask,
      isCompleted: false,
    };

    // add a new todo task to the 'contents' list
    state.todos[parentIdx].contents.push(newTask);
  },
  resetSelectedTodo(state) {
    state.selectedTodo = null;
    state.openTodoId = null;
  },
  updateHiddenStatus(state, payload) {
    // toggle the hidden status of the selected todo
    let parentIdx = payload.parentTodoId;
    state.todos[parentIdx].isHideCompleted =
      !state.todos[parentIdx].isHideCompleted;
  },
  deleteTodo(state, payload) {
    let parentId = payload;

    // filter out the todo whose id matches the parent id
    state.todos = state.todos.filter((todo) => todo.id !== parentId);
  },
  deleteTodoTask(state, payload) {
    let parentIdx = payload.parentTodoId;
    let childIdx = payload.childTodoId;

    // delete the task whose index matches the child index
    state.todos[parentIdx].contents.splice(childIdx, 1);
  },
  closeOpenFields(state, payload) {
    state.isCloseOpenFields = payload;
  },
  setOpenTodoId(state, payload) {
    state.openTodoId = payload;
  },
};
