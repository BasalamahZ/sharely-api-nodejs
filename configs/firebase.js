import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Replace these values with your project's ones
// (you can find such code in the Console)
const firebaseConfig = {
    apiKey: "AIzaSyCcJxmjD7YmRcPUQQIChou4KoRWPyr-skY",
    authDomain: "sharely-api.firebaseapp.com",
    projectId: "sharely-api",
    storageBucket: "sharely-api.appspot.com",
    messagingSenderId: "640700045874",
    appId: "1:640700045874:web:1cbdbc15d3d662d54efa2b",
    measurementId: "G-2FNXL98HQK"
  };

export const app = initializeApp(firebaseConfig);
const messaging = getMessaging();

export async function getFCMToken() {
    try {
        // Don't forget to paste your VAPID key here
		// (you can find it in the Console too)
        const token = await getToken(messaging, { vapidKey: "" });
        return token;
    } catch (e) {
        console.log('getFCMToken error', e);
        return undefined
    }
}