"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Post } from '../page';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

// Type definition for a single comment
type Comment = {
  id: string;
  authorName: string;
  authorImageUrl?: string;
  text: string;
  timestamp: Timestamp;
};

type CommentSectionProps = {
  post: Post;
};

export const CommentSection = ({ post }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  // REAL-TIME LISTENER FOR COMMENTS
  useEffect(() => {
    const commentsRef = collection(db, 'posts', post.id, 'comments');
    const q = query(commentsRef, orderBy('timestamp', 'asc'));

    // onSnapshot returns an unsubscribe function
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData: Comment[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
    });

    // Cleanup: unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [post.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    if (!user) {
      alert('Please login to comment');
      return;
    }

    const commentsRef = collection(db, 'posts', post.id, 'comments');
    await addDoc(commentsRef, {
      text: newComment,
      authorName: user.displayName || 'Anonymous',
      authorImageUrl: user.photoURL || '',
      timestamp: serverTimestamp(),
    });

    setNewComment(''); // Clear the input field
  };

  return (
    <div className="p-4">
      {/* Post Caption */}
      <div className="text-brand-green/90 mb-4">
        <span className="font-bold mr-2">{post.authorName}</span>
        <span className="font-bold">{post.title}:</span>
        <span className="ml-1">{post.excerpt}</span>
      </div>

      {/* List of Comments */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2">
            {comment.authorImageUrl && (
              <Image
                src={comment.authorImageUrl}
                alt={comment.authorName}
                width={24}
                height={24}
                className="rounded-full mt-0.5"
              />
            )}
            <div className="text-sm flex-1">
              <span className="font-bold text-brand-green mr-2">{comment.authorName}</span>
              <span className="text-brand-green/80">{comment.text}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center gap-2">
          <Image
            src={user.photoURL || '/default-avatar.png'}
            alt="Your profile"
            width={24}
            height={24}
            className="rounded-full"
          />
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border-b border-brand-green/30 focus:outline-none focus:border-brand-blue text-sm py-1"
          />
          <button
            type="submit"
            className="text-brand-blue font-semibold text-sm hover:text-brand-blue/80"
          >
            Post
          </button>
        </form>
      ) : (
        <div className="mt-4 text-center">
          <a href="/login" className="text-brand-blue text-sm hover:underline">
            Log in to comment
          </a>
        </div>
      )}
    </div>
  );
};