"use client";

import { useState, useEffect } from 'react';
import { doc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

// A more detailed HeartIcon that can show a "filled" state
const HeartIcon = ({ isLiked }: { isLiked: boolean }) => (
  <svg
    className={`w-7 h-7 cursor-pointer transition-all duration-200 ease-in-out ${
      isLiked ? 'text-red-500 scale-110' : 'text-brand-green/80 hover:text-red-400'
    }`}
    fill={isLiked ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

type LikeButtonProps = {
  postId: string;
  initialLikeCount: number;
};

export const LikeButton = ({ postId, initialLikeCount }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(() => {
    if (typeof window !== 'undefined') {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      return likedPosts.includes(postId);
    }
    return false;
  });

  // Listen to real-time updates of the post's likeCount
  useEffect(() => {
    const postRef = doc(db, 'posts', postId);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLikes(data.likeCount || 0);
      }
    });
    return unsubscribe;
  }, [postId]);

  const handleLike = async () => {
    const postRef = doc(db, 'posts', postId);
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    
    // Optimistic UI update
    const wasLiked = isLiked;
    const prevLikes = likes;
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
      // Update localStorage
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts.filter((id: string) => id !== postId)));
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      // Update localStorage
      localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postId]));
    }

    // Update Firestore
    try {
      await updateDoc(postRef, {
        likeCount: increment(wasLiked ? -1 : 1),
      });
    } catch (error) {
      console.error('Error updating like count:', error);
      // Revert optimistic update
      setLikes(prevLikes);
      setIsLiked(wasLiked);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    }
  };

  return (
    <div>
      <div onClick={handleLike}>
        <HeartIcon isLiked={isLiked} />
      </div>
      <div className="font-bold text-sm text-brand-green mt-2">
        {likes.toLocaleString()} likes
      </div>
    </div>
  );
};