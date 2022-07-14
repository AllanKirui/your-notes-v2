import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

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

const app = createApp(App);

app.use(router);

app.mount("#app");
