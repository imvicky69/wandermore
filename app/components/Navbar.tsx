"use client"; // We need this for the hook and interactive elements

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORT THE AUTH HOOK

const Navbar = () => {
  const { user, googleSignIn, logOut } = useAuth(); // <-- 2. USE THE HOOK

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-cream/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-green/20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl text-brand-green font-bold hover:text-brand-blue transition-colors">
            Wandermore
          </Link>
          
          {/* --- DYNAMIC LOGIN/LOGOUT UI --- */}
          <div>
            {user ? (
              // If user is logged in
              <div className="flex items-center space-x-4">
                <p className="text-brand-green">Welcome, {user.displayName?.split(' ')[0]}</p>
                <Image
                  src={user.photoURL || ''}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <button
                  onClick={handleSignOut}
                  className="bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // If user is not logged in
              <button
                onClick={handleSignIn}
                className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
              >
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;