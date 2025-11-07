// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4lhRN6aK1FxZxbBeKFlPimCpPeX7FItg",
    authDomain: "ai-travel-planner-3ac26.firebaseapp.com",
    projectId: "ai-travel-planner-3ac26",
    storageBucket: "ai-travel-planner-3ac26.firebasestorage.app",
    messagingSenderId: "1032650322951",
    appId: "1:1032650322951:web:b6d89073d5aa2537bf26a2",
    measurementId: "G-CB3WWE6GVF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);