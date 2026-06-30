import { getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const cfg = {
	apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
}

// Guard against double-initialisation in Astro's Node.js build process
const app = getApps().length ? getApps()[0] : initializeApp(cfg)
export const db = getFirestore(app)
export default app
