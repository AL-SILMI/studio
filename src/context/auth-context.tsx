'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  deleteUser as deleteFirebaseUser,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // The user object from onAuthStateChanged has the necessary profile info
        setUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateFirebaseProfile(user, { displayName: fullName });

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
    };
    await setDoc(doc(db, 'users', user.uid), {
        // Storing only non-sensitive data or data needed for specific queries
        uid: user.uid,
        displayName: fullName,
        email: user.email,
    });
    setUserProfile(profile);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (displayName: string, email: string) => {
    if (user) {
      // Optimistically update local state
      setUserProfile((prev) => prev ? { ...prev, displayName, email } : null);
      
      const updatePromises = [];
      
      if (user.displayName !== displayName) {
        updatePromises.push(updateFirebaseProfile(user, { displayName }));
      }
      
      updatePromises.push(updateDoc(doc(db, 'users', user.uid), { displayName, email }));

      await Promise.all(updatePromises);

      // Re-sync with the user object to get the latest state
      if(auth.currentUser){
        setUser(auth.currentUser);
        setUserProfile({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName
        })
      }


    } else {
        throw new Error("No user is signed in.");
    }
  };

  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteDoc(doc(db, 'users', currentUser.uid));
      await deleteFirebaseUser(currentUser);
    } else {
        throw new Error("No user is signed in to delete.");
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signup,
    login,
logout,
    updateUserProfile,
    deleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
