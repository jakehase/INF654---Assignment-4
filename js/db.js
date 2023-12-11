import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDfT_IXUWWsn3LuYuLAB1YoN00ORmWBTmE",
    authDomain: "portfolio-7c105.firebaseapp.com",
    projectId: "portfolio-7c105",
    storageBucket: "portfolio-7c105.appspot.com",
    messagingSenderId: "751382361893",
    appId: "1:751382361893:web:48b3a29fc4cfda1a628ccc",
    measurementId: "G-Y2TKL7CNLS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getTasks(db) {
  const tasksCol = collection(db, "tasks");
  const taskSnapshot = await getDocs(tasksCol);
  const taskList = taskSnapshot.docs.map((doc) => doc);
  return taskList;
}

const unsub = onSnapshot(collection(db, "tasks"), (doc) => {
  //   console.log(doc.docChanges());
  doc.docChanges().forEach((change) => {
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === "added") {
      //Call render function in UI
      renderTask(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      //do something
      removeTask(change.doc.id);
    }
  });
});

//add new task
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  addDoc(collection(db, "tasks"), {
    title: form.title.value,
    description: form.description.value,
  }).catch((error) => console.log(error));
  form.title.value = "";
  form.description.value = "";
});

//delete task
const taskContainer = document.querySelector(".tasks");
taskContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "I") {
    const id = event.target.getAttribute("data-id");
    deleteDoc(doc(db, "tasks", id));
  }
});
