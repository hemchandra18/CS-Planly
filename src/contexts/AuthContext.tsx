import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

export interface AppUser {
  id: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  user_metadata: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
}

export interface AppSession {
  user: AppUser;
}

interface AuthContextValue {
  session: AppSession | null;
  user: AppUser | null;
  loading: boolean;
  onboardingCompleted: boolean | null;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>;
  signInWithOAuth: (
    provider: 'google' | 'github',
    options?: { redirectTo?: string; queryParams?: Record<string, string> }
  ) => Promise<{ error: Error | null }>;
  signInAsDemo: () => void;
  signOut: () => Promise<{ error: Error | null }>;
  sendPasswordReset: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toError(error: unknown): Error | null {
  return error instanceof Error ? error : error ? new Error(String(error)) : null;
}

function mapFirebaseUser(user: FirebaseUser | null): AppUser | null {
  if (!user) return null;
  return {
    id: user.uid,
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    user_metadata: {
      full_name: user.displayName || user.email?.split('@')[0] || 'Planly Learner',
      avatar_url: user.photoURL,
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  const session = useMemo<AppSession | null>(
    () => (currentUser ? { user: currentUser } : null),
    [currentUser]
  );

  const refreshProfile = async () => {
    if (!auth.currentUser) {
      setOnboardingCompleted(null);
      return;
    }

    try {
      const docRef = doc(db, 'profiles', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOnboardingCompleted(Boolean(data?.onboarding_completed));
      } else {
        setOnboardingCompleted(false);
      }
    } catch (err) {
      console.warn('Error reading profile from Firestore:', err);
      // Fallback check in localStorage in case Firestore security rules or offline
      const localOnboarding = localStorage.getItem(`planly_onboarding_${auth.currentUser.uid}`);
      setOnboardingCompleted(localOnboarding === 'true');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const mapped = mapFirebaseUser(firebaseUser);
      setCurrentUser(mapped);

      if (firebaseUser) {
        try {
          const docRef = doc(db, 'profiles', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setOnboardingCompleted(Boolean(docSnap.data()?.onboarding_completed));
          } else {
            // Check localStorage fallback
            const localOnboarding = localStorage.getItem(`planly_onboarding_${firebaseUser.uid}`);
            if (localOnboarding === 'true') {
              setOnboardingCompleted(true);
            } else {
              try {
                await setDoc(docRef, {
                  id: firebaseUser.uid,
                  full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Planly Learner',
                  email: firebaseUser.email,
                  onboarding_completed: false,
                  created_at: new Date().toISOString(),
                }, { merge: true });
              } catch (writeErr) {
                console.warn('Could not write initial profile to Firestore:', writeErr);
              }
              setOnboardingCompleted(false);
            }
          }
        } catch (e) {
          console.warn('Error checking onboarding status from Firestore:', e);
          const localOnboarding = localStorage.getItem(`planly_onboarding_${firebaseUser.uid}`);
          setOnboardingCompleted(localOnboarding === 'true');
        }
      } else {
        setOnboardingCompleted(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: currentUser,
      loading,
      onboardingCompleted,
      refreshProfile,
      async signIn(email, password) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return { error: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      async signUp(email, password, fullName) {
        try {
          const res = await createUserWithEmailAndPassword(auth, email, password);
          if (fullName && res.user) {
            await updateProfile(res.user, { displayName: fullName });
          }
          if (res.user) {
            try {
              await setDoc(doc(db, 'profiles', res.user.uid), {
                id: res.user.uid,
                full_name: fullName,
                email,
                onboarding_completed: false,
                created_at: new Date().toISOString(),
              }, { merge: true });
            } catch (err) {
              console.warn('Could not create profile doc in Firestore:', err);
            }
          }
          return { error: null, needsEmailConfirmation: false };
        } catch (err) {
          return { error: toError(err), needsEmailConfirmation: false };
        }
      },
      async signInWithOAuth(provider: 'google' | 'github') {
        try {
          if (provider === 'google') {
            const res = await signInWithPopup(auth, googleProvider);
            if (res.user) {
              try {
                const docRef = doc(db, 'profiles', res.user.uid);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                  await setDoc(docRef, {
                    id: res.user.uid,
                    full_name: res.user.displayName || res.user.email?.split('@')[0] || 'Planly Learner',
                    email: res.user.email,
                    onboarding_completed: false,
                    created_at: new Date().toISOString(),
                  }, { merge: true });
                }
              } catch (err) {
                console.warn('Could not sync Google user profile to Firestore:', err);
              }
            }
            return { error: null };
          }
          return { error: new Error(`Provider ${provider} is not configured.`) };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      signInAsDemo() {
        // Kept for interface compatibility
      },
      async signOut() {
        try {
          await firebaseSignOut(auth);
          setOnboardingCompleted(null);
          return { error: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      async sendPasswordReset(email) {
        try {
          await sendPasswordResetEmail(auth, email);
          return { error: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      async updatePassword(password) {
        try {
          if (!auth.currentUser) throw new Error('No user is currently signed in');
          await firebaseUpdatePassword(auth.currentUser, password);
          return { error: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
    }),
    [currentUser, loading, onboardingCompleted, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
