// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
        apiKey: "AIzaSyCwY3hgC5qmtiV-2Xh-EODZiRov6_YjTo0",
        authDomain: "macrame-c1d0a.firebaseapp.com",
        projectId: "macrame-c1d0a",
        storageBucket: "macrame-c1d0a.appspot.com",
        messagingSenderId: "281315263334",
        appId: "1:281315263334:web:21ec6dd8bd17feb98ffea7",
        measurementId: "G-YJDFZ6S4TQ"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export Firebase functions for use in script.js
export { db, ref, push, get };