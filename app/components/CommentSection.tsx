"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Post } from '../page';

// Type definition for a single comment
type Comment = {
  id: string;
  authorName: string;
  text: string;
  timestamp: Timestamp;
};

type CommentSectionProps = {
  post: Post;
};

export const CommentSection = ({ post }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

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

    const commentsRef = collection(db, 'posts', post.id, 'comments');
    await addDoc(commentsRef, {
      text: newComment,
      authorName: 'Anonymous', // We'll update this with real auth later
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
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="text-sm">
            <span className="font-bold text-brand-green mr-2">{comment.authorName}</span>
            <span className="text-brand-green/80">{comment.text}</span>
          </div>
        ))}
      </div>
      
      {/* Add Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mt-4">
        <input 
          type="text" 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-transparent border-b border-brand-green/30 focus:outline-none focus:border-brand-blue text-sm py-1"
        />
      </form>
    </div>
  );
};