import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import store from "@/store/index";

import BaseCard from "@/components/ui/BaseCard";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYpw8q3JP3BCY64r-Tk7yoGITmZYTAsiI",
  authDomain: "yournotes-v2.firebaseapp.com",
  projectId: "yournotes-v2",
  storageBucket: "yournotes-v2.appspot.com",
  messagingSenderId: "120893944778",
  appId: "1:120893944778:web:cca20128d2adb5d4369533",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// initialize Firestore services
export const db = getFirestore();
// get a collection reference
export const todosColRef = collection(db, "todos");
export const preferencesColRef = collection(db, "preferences");
export const notesColRef = collection(db, "notes");
export const usernamesColRef = collection(db, "usernames");
// export other firestore methods
export const _addDoc = addDoc;
export const _setDoc = setDoc;
export const _query = query;
export const _where = where;
export const _onSnapshot = onSnapshot;
export const _orderBy = orderBy;
export const _doc = doc;
export const _updateDoc = updateDoc;
export const _arrayUnion = arrayUnion;
export const _deleteDoc = deleteDoc;
export const _arrayRemove = arrayRemove;

const app = createApp(App);

app.component("base-card", BaseCard);

app.use(router);
app.use(store);

app.mount("#app");
