"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import PostView from '../components/PostView';
import { Post } from '../page';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(
          postsRef,
          where('authorId', '==', user.uid),
          orderBy('publishedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          posts.push({ id: doc.id, ...data } as Post);
        });
        
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg border border-brand-green/20 p-8 mb-8">
        <div className="flex items-center gap-8">
          <Image
            src={user.photoURL || '/default-avatar.png'}
            alt={user.displayName || 'User'}
            width={120}
            height={120}
            className="rounded-full border-4 border-brand-green/30"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-brand-green mb-2">
              {user.displayName}
            </h1>
            <p className="text-brand-green/70 mb-4">{user.email}</p>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-green">{userPosts.length}</p>
                <p className="text-sm text-brand-green/60">Posts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-brand-green mb-6">Your Posts</h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-brand-green/60">Loading...</p>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-brand-green/20">
            <p className="text-brand-green/60 mb-4">You haven&apos;t created any posts yet</p>
            <a
              href="/create"
              className="inline-block bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-brand-blue/90 transition-colors font-semibold"
            >
              Create Your First Post
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8">
            {userPosts.map((post) => (
              <PostView key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
