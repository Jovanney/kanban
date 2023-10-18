
import {signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'
import { auth } from './firebaseService';

export const signIn = async (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const signOutUser = async () => signOut(auth);

export const onAuthStateChange = (onChange: (user: any) => void) => onAuthStateChanged(auth, onChange);