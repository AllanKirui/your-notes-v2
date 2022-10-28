export default {
  setSelectedTodo(state, payload) {
    // get the todo whose id matches the payload id
    state.selectedTodo = state.todos.filter(
      (todo) => todo.id === payload.todoId
    )[0];
  },
  async updateCompletionStatus(state, payload) {
    let parentIdx = payload.parentTodoId;
    let childIdx = payload.childTodoId;
    let status = payload.status;

    // get the task marked as completed
    let completedTask = state.todos[parentIdx].contents[childIdx];

    // make a copy of the completed task
    let copyOfCompletedTask = {};
    Object.assign(copyOfCompletedTask, completedTask);
    copyOfCompletedTask.isCompleted = true;

    // make a copy of the task before it was marked as complete
    let taskBeforeCompletion = {};
    Object.assign(taskBeforeCompletion, completedTask);
    taskBeforeCompletion.isCompleted = false;

    const docRef = payload.doc(payload.db, "todos", payload.firestoreDocId);

    // if the todo task has been marked as completed
    if (!status) {
      try {
        // delete the task marked as complete from the 'contents' list of the firestore document
        await payload.updateDoc(docRef, {
          contents: payload.arrayRemove(copyOfCompletedTask),
        });
        // add the task marked as incomplete to the 'contents' list of the firestore document
        await payload.updateDoc(docRef, {
          contents: payload.arrayUnion(completedTask),
        });
      } catch (error) {
        alert(`Something went wrong!\n${error}`);
      }
      return;
    }

    // if the todo task has been marked as incomplete
    try {
      // delete the task marked as incomplete from the 'contents' list of the firestore document
      await payload.updateDoc(docRef, {
        contents: payload.arrayRemove(taskBeforeCompletion),
      });
      // add the task marked as complete to the 'contents' list of the firestore document
      await payload.updateDoc(docRef, {
        contents: payload.arrayUnion(completedTask),
      });
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }
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

    // delete a todo with a matching firestore document id from the 'todos' collection
    try {
      await payload.deleteDoc(
        payload.doc(payload.db, "todos", payload.firestoreDocId)
      );
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }
  },
  async deleteTodoTask(state, payload) {
    let parentIdx = payload.parentTodoId;
    let childIdx = payload.childTodoId;
    let selectedTodo = state.todos.filter((todo) => todo.id === parentIdx)[0];
    let data = selectedTodo.contents[childIdx];
    const docRef = payload.doc(payload.db, "todos", payload.firestoreDocId);

    // delete the selected todo task from the 'contents' list of the firestore document
    try {
      await payload.updateDoc(docRef, {
        contents: payload.arrayRemove(data),
      });
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }
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
