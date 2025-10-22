"use client";
import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../../firebase/config'; // Import auth from config
// Define the shape of your context data
interface AuthContextType {
user: User | null;
googleSignIn: () => void;
logOut: () => void;
}
// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Define the props for your AuthProvider component
interface AuthProviderProps {
children: ReactNode;
}
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
const [user, setUser] = useState<User | null>(null);
// We now use the imported auth instance
const googleSignIn = () => {
const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider);
};
const logOut = () => {
signOut(auth);
};
useEffect(() => {
// This listener checks if the user's auth state changes (login/logout)
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
setUser(currentUser);
});
// Cleanup function to remove the listener when the component unmounts
return () => unsubscribe();
// auth is from an import so it's stable and doesn't need to be in the dependency array
}, []);
return (
<AuthContext.Provider value={{ user, googleSignIn, logOut }}>
{children}
</AuthContext.Provider>
);
};
// Custom hook to use the auth context easily in other components
export const useAuth = () => {
const context = useContext(AuthContext);
if (context === undefined) {
throw new Error('useAuth must be used within an AuthContextProvider');
}
return context;
};