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
  async saveChanges(state, payload) {
    // reset store props
    state.hasUpdatedTodoTask = false;

    let parentIdx = payload.parentTodoId;
    let childIdx = payload.childTodoId;
    let oldData = {
      text: state.todos[parentIdx].contents[childIdx].text,
      isCompleted: false,
    };
    let newData = {
      text: payload.newText,
      isCompleted: false,
    };

    // TODO: handle logic for default todo
    // update the 'text' prop
    // if (state.defaultTodo) {
    //   state.todos[parentIdx - 1].contents[childIdx].text = payload.newText;
    //   return;
    // }
    // TODO: delete
    // state.todos[parentIdx].contents[childIdx].text = payload.newText;

    const docRef = payload.doc(payload.db, "todos", payload.firestoreDocId);

    try {
      // delete the old task from the 'contents' list of the firestore document
      await payload.updateDoc(docRef, {
        contents: payload.arrayRemove(oldData),
      });
      // delete the updated task to the 'contents' list of the firestore document
      await payload.updateDoc(docRef, {
        contents: payload.arrayUnion(newData),
      });
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }

    state.hasUpdatedTodoTask = true;
  },
  async addNewTodo(_, payload) {
    try {
      // add a new todo as a document to the firebase 'todos' collection
      await payload.addDoc(payload.colRef, payload.data);
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }
  },
  async addNewTodoTask(_, payload) {
    const docRef = payload.doc(payload.db, "todos", payload.firestoreDocId);

    let data = {
      text: payload.newTask,
      isCompleted: false,
    };

    try {
      // add a new todo task to the 'contents' list of the firestore document
      await payload.updateDoc(docRef, {
        contents: payload.arrayUnion(data),
      });
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }
  },
  resetSelectedTodo(state) {
    state.selectedTodo = null;
    state.openTodoId = null;
  },
  async updateHiddenStatus(state, payload) {
    // toggle the hidden status of the selected todo
    let parentIdx = payload.parentTodoId;
    state.todos[parentIdx].isHideCompleted =
      !state.todos[parentIdx].isHideCompleted;

    const docRef = payload.doc(payload.db, "todos", payload.firestoreDocId);

    // update the 'isHideCompleted' prop of the selectedTodo in firestore
    try {
      // delete the task marked as incomplete from the 'contents' list of the firestore document
      await payload.updateDoc(docRef, {
        isHideCompleted: state.todos[parentIdx].isHideCompleted,
      });
    } catch (error) {
      alert(`Something went wrong!\n${error}`);
    }
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
