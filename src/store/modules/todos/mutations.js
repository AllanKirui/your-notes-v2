import {
  db,
  _doc,
  todosColRef,
  _addDoc,
  _setDoc,
  _deleteDoc,
  _updateDoc,
  _arrayRemove,
  _arrayUnion,
} from "@/main.js";

// a function that handles firebase errors
const throwException = (error, location) => {
  let message = "";

  if (error.code && error.message) {
    message = `Oops! It appears you've discovered an Epic Bug ◔ ⌣ ◔\n\nLocation: ${location}\n\nError Code: ${error.code}\n\nReasons: ${error.message}`;
  } else {
    message = `Oops! It appears you've discovered an Epic Bug ◔ ⌣ ◔\n\nLocation: ${location}\n\n${error}"`;
  }
  alert(message);
};

export default {
  setSelectedTodo(state, payload) {
    // get the todo whose id matches the payload id
    state.selectedTodo = state.todos.filter(
      (todo) => todo.id === payload.todoId
    )[0];
  },
  async updateCompletionStatus(state, payload) {
    let selectedTodo = state.selectedTodo;
    let todoTaskIndex = payload.childTodoId;
    let isCompleted = payload.status;

    // get the task marked as completed
    let completedTask = selectedTodo.contents[todoTaskIndex];

    // make a copy of the completed task
    let copyOfCompletedTask = {};
    Object.assign(copyOfCompletedTask, completedTask);
    copyOfCompletedTask.isCompleted = true;

    // make a copy of the task before it was marked as complete
    let taskBeforeCompletion = {};
    Object.assign(taskBeforeCompletion, completedTask);
    taskBeforeCompletion.isCompleted = false;

    const docRef = _doc(db, "todos", payload.firestoreDocId);

    // if the todo task has been marked as incomplete
    if (!isCompleted) {
      try {
        // delete the task marked as complete from the 'contents' list of the firestore document
        await _updateDoc(docRef, {
          contents: _arrayRemove(copyOfCompletedTask),
        });
        // add the task marked as incomplete to the 'contents' list of the firestore document
        await _updateDoc(docRef, {
          contents: _arrayUnion(completedTask),
        });
      } catch (error) {
        throwException(error, "updateCompletionStatus( ) fn");
      }
      return;
    }

    // if the todo task has been marked as completed
    try {
      // delete the task marked as incomplete from the 'contents' list of the firestore document
      await _updateDoc(docRef, {
        contents: _arrayRemove(taskBeforeCompletion),
      });
      // add the task marked as complete to the 'contents' list of the firestore document
      await _updateDoc(docRef, {
        contents: _arrayUnion(completedTask),
      });
    } catch (error) {
      throwException(error, "updateCompletionStatus( ) fn");
    }
  },
  async saveChanges(state, payload) {
    // reset store props
    state.hasUpdatedTodoTask = false;

    let selectedTodo = state.selectedTodo;
    let todoTaskIndex = payload.childTodoId;

    // get the data before and after edits were made
    let oldData = {
      text: selectedTodo.contents[todoTaskIndex].text,
      isCompleted: false,
    };
    let newData = {
      text: payload.newText,
      isCompleted: false,
    };

    const docRef = _doc(db, "todos", payload.firestoreDocId);

    try {
      // delete the old task from the 'contents' list of the firestore document
      await _updateDoc(docRef, {
        contents: _arrayRemove(oldData),
      });

      // if newData.text is empty, don't add it
      if (!newData.text) return;

      // add the updated task to the 'contents' list of the firestore document
      await _updateDoc(docRef, {
        contents: _arrayUnion(newData),
      });
    } catch (error) {
      throwException(error, "saveChanges( ) fn");
    }

    state.hasUpdatedTodoTask = true;
  },
  async addNewTodo(_, payload) {
    try {
      // add a new todo as a document to the firebase 'todos' collection
      await _addDoc(todosColRef, payload);
    } catch (error) {
      throwException(error, "addNewTodo( ) fn");
    }
  },
  async addNewTodoTask(_, payload) {
    const docRef = _doc(db, "todos", payload.firestoreDocId);

    let data = {
      text: payload.newTask,
      isCompleted: false,
    };

    try {
      // add a new todo task to the 'contents' list of the firestore document
      await _updateDoc(docRef, {
        contents: _arrayUnion(data),
      });
    } catch (error) {
      throwException(error, "addNewTodoTask( ) fn");
    }
  },
  resetSelectedTodo(state) {
    state.selectedTodo = null;
    state.openTodoId = null;
  },
  async updateHiddenStatus(state, payload) {
    // toggle the hidden status of the selected todo
    state.selectedTodo.isHideCompleted = !state.selectedTodo.isHideCompleted;

    const docRef = _doc(db, "todos", payload.firestoreDocId);

    // update the 'isHideCompleted' prop of the selectedTodo in firestore
    try {
      // delete the task marked as incomplete from the 'contents' list of the firestore document
      await _updateDoc(docRef, {
        isHideCompleted: state.selectedTodo.isHideCompleted,
      });
    } catch (error) {
      throwException(error, "updateHiddenStatus( ) fn");
    }
  },
  async deleteTodo(state, data) {
    let selectedTodo = state.selectedTodo;

    // if todo is the default welcome todo, delete it and update
    // the user preferences
    if (data.isDefault) {
      state.todos = state.todos.filter((todo) => todo.id !== selectedTodo.id);

      let newPreferences = {
        theme: data.theme,
        fontSize: data.fontSize,
        hasDeletedDefaultNote: data.hasDeletedDefaultNote,
        hasDeletedDefaultTodo: true,
      };

      try {
        // add a new collection to Firestore called 'preferences', overwrite existing ones
        await _setDoc(
          _doc(db, "preferences", data.firestoreDocId),
          newPreferences
        );
      } catch (error) {
        throwException(error, "deleteTodo( ) fn");
      }
      return;
    }

    // delete a todo with a matching firestore document id from the 'todos' collection
    try {
      await _deleteDoc(_doc(db, "todos", data.firestoreDocId));
    } catch (error) {
      throwException(error, "deleteTodo( ) fn");
    }
  },
  async deleteTodoTask(state, payload) {
    let selectedTodo = state.selectedTodo;
    let todoTaskIndex = payload.childTodoId;
    let data = selectedTodo.contents[todoTaskIndex];

    const docRef = _doc(db, "todos", payload.firestoreDocId);

    // delete the selected todo task from the 'contents' list of the firestore document
    try {
      await _updateDoc(docRef, {
        contents: _arrayRemove(data),
      });
    } catch (error) {
      throwException(error, "deleteTodoTask( ) fn");
    }
  },
  closeOpenFields(state, payload) {
    state.isCloseOpenFields = payload;
  },
  setOpenTodoId(state, payload) {
    state.openTodoId = payload;
  },
  async restoreWelcomeTodo(state, payload) {
    state.todos.unshift(state.welcomeTodo);

    // get the new preferences
    let newPreferences = { ...payload.userPreferences };
    newPreferences.hasDeletedDefaultTodo = false;

    // update the 'preferences' collection in firestore
    try {
      // add a new collection to Firestore called 'preferences', overwrite existing ones
      await _setDoc(
        _doc(db, "preferences", payload.firestoreDocId),
        newPreferences
      );
    } catch (error) {
      throwException(error, "restoreWelcomeTodo( ) fn");
    }
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
