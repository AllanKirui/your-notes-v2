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

    // TODO: use where clause to implement this for Firestore
  },
  saveChanges(state, payload) {
    let parentIdx = payload.parentTodoId;
    let childIdx = payload.childTodoId;

    // update the 'text' prop
    if (state.defaultTodo) {
      state.todos[parentIdx - 1].contents[childIdx].text = payload.newText;
      return;
    }
    state.todos[parentIdx].contents[childIdx].text = payload.newText;
  },
  addNewTodo(_, payload) {
    // add a new todo as a document to the firebase 'todos' collection
    payload.addDoc(payload.colRef, payload.data);
  },
  addNewTodoTask(_, payload) {
    const docRef = payload.doc(payload.db, "todos", payload.firestoreDocId);

    let data = {
      text: payload.newTask,
      isCompleted: false,
    };

    // add a new todo task to the 'contents' list of the firestore document
    payload
      .updateDoc(docRef, {
        contents: payload.arrayUnion(data),
      })
      .then(() => {
        console.log("Added new task successfully");
      })
      .catch((error) => {
        alert(`Something went wrong!\n${error}`);
      });
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
  async deleteTodo(state, payload) {
    // if a todo is deleted while in mobile view reset the following state props
    if (payload.isMobileView) {
      state.selectedTodo = null;
      state.openTodoId = null;
    }

    let parentId = payload.id;

    // TODO: handle, deleting, editing, restoring welcome todo/note
    // if todo is the default welcome todo, make a copy of it
    // allowing user to restore it later
    if (payload.isDefault) {
      state.defaultTodo = state.todos[parentId];
      state.todos = state.todos.filter((todo) => todo.id !== parentId);
      return;
    }

    // filter out the todo whose id matches the parent id
    try {
      // delete a todo with a matching firestore document id from the 'todos' collection
      await payload.deleteDoc(
        payload.doc(payload.db, "todos", payload.firestoreDocId)
      );
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }
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
  restoreWelcomeTodo(state, payload) {
    state.todos.unshift(payload);
  },
  resetDefaultTodo(state) {
    state.defaultTodo = null;
  },
  addRealtimeData(state, payload) {
    // spread the data to the new object and add the unique firestore id as well
    state.todos.push({ ...payload.data(), fireId: payload.id });
  },
  clearTodosList(state) {
    // clear the todos list before updating it with new data
    state.todos = [];
  },
  addWelcomeTodo(state) {
    // include the Welcome Todo along with new data
    state.todos.push(state.welcomeTodo);
  },
};
