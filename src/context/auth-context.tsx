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
  updateProfile,
  deleteUser as deleteFirebaseUser,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (name: string, email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = ['/login', '/signup'].includes(pathname);
    const isProtectedRoute = ['/dashboard', '/profile'].includes(pathname);

    if (!user && isProtectedRoute) {
      router.push('/login');
    } else if (user && isAuthRoute) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);


  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    await updateProfile(userCredential.user, { displayName: name });
    
    const newUserProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: name,
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), newUserProfile);
    setUser(userCredential.user);
    setUserProfile(newUserProfile);
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const updateUserProfile = async (name: string, email: string) => {
    if (!user) throw new Error("Not authenticated");
    
    await updateProfile(user, { displayName: name });
    await updateDoc(doc(db, 'users', user.uid), { displayName: name, email });
    
    //
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      setUserProfile(userDoc.data() as UserProfile);
    }
  };
  
  const deleteAccount = async () => {
    if (!user) throw new Error("Not authenticated");
    
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteFirebaseUser(user);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
