"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logOut();
      setShowMenu(false);
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white border-b border-brand-green/20 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl text-brand-green font-bold hover:text-brand-blue transition-colors">
            Wandermore
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* Home Icon */}
                <Link href="/" className="hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-brand-green hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>

                {/* Create Post Button */}
                <Link href="/create" className="hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-brand-green hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>

                {/* User Profile Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="focus:outline-none"
                  >
                    <Image
                      src={user.photoURL || '/default-avatar.png'}
                      alt="User Profile"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-brand-green/30 hover:border-brand-blue transition-colors"
                    />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-brand-green/20 py-2">
                      <div className="px-4 py-2 border-b border-brand-green/10">
                        <p className="text-sm font-semibold text-brand-green">{user.displayName}</p>
                        <p className="text-xs text-brand-green/60">{user.email}</p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-brand-green hover:bg-brand-green/5 transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-brand-green hover:bg-brand-green/5 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link 
                href="/login"
                className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors font-semibold"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;