import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
  handleFirestoreError,
  OperationType,
} from '../firebase';

export interface UserProfile {
  uid?: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email?: string, name?: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTargetTool?: string;
  openAuthModal: (targetTool?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const isLogged = localStorage.getItem('isLoggedIn') === 'true';
      const storedCurrentUser = localStorage.getItem('currentUser');
      if (isLogged && storedCurrentUser) {
        const parsed = JSON.parse(storedCurrentUser);
        const name = parsed.name || 'Khushi';
        const email = parsed.email || 'khushi@lingua.ai';
        return {
          uid: parsed.uid,
          email,
          name,
          avatarUrl: parsed.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        };
      }
      const storedAuthUser = localStorage.getItem('lingua_auth_user');
      if (isLogged && storedAuthUser) {
        return JSON.parse(storedAuthUser);
      }
    } catch {}
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTargetTool, setAuthModalTargetTool] = useState<string | undefined>(undefined);

  const isAuthenticated = Boolean(user);

  // Synchronize Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner';
        const email = firebaseUser.email || 'learner@lingua.ai';
        const avatarUrl = firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name,
          email,
          avatarUrl,
        };
        setUser(profile);

        // Sync user document in Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const existingSnap = await getDoc(userDocRef);
          if (!existingSnap.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              name,
              email,
              appLanguage: localStorage.getItem('selectedLanguage') || 'en',
              theme: 'default',
              fontSize: 'medium',
              speechRate: 1.0,
              useDyslexicFont: false,
              readingLevel: 'Developing',
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Firestore user sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email, uid: user.uid }));
        localStorage.setItem('lingua_auth_user', JSON.stringify(user));
      } else {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lingua_auth_user');
      }
    } catch {}
  }, [user]);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const name = fbUser.displayName || 'Learner';
      const email = fbUser.email || '';
      const avatarUrl = fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
      
      const newUser: UserProfile = {
        uid: fbUser.uid,
        email,
        name,
        avatarUrl,
      };
      setUser(newUser);

      // Create / update Firestore profile
      const userRef = doc(db, 'users', fbUser.uid);
      await setDoc(userRef, {
        uid: fbUser.uid,
        name,
        email,
        appLanguage: localStorage.getItem('selectedLanguage') || 'en',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      login('khushi@lingua.ai', 'Khushi');
    }
  };

  const login = (email = 'khushi@lingua.ai', name = 'Khushi') => {
    const finalName = name.trim() || 'Khushi';
    const newUser: UserProfile = {
      email,
      name: finalName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalName)}`,
    };
    setUser(newUser);
    try {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ name: finalName, email }));
      localStorage.setItem('lingua_auth_user', JSON.stringify(newUser));

      const storedProfile = localStorage.getItem('lingua_profile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        localStorage.setItem('lingua_profile', JSON.stringify({ ...parsed, name: finalName }));
      }
    } catch {}
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    setUser(null);
    try {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('lingua_auth_user');

      const storedProfile = localStorage.getItem('lingua_profile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        localStorage.setItem('lingua_profile', JSON.stringify({ ...parsed, name: 'Guest' }));
      }
    } catch {}
  };

  const openAuthModal = (targetTool?: string) => {
    setAuthModalTargetTool(targetTool);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        authModalTargetTool,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
