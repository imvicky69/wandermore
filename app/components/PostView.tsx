"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Post } from '../page';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';

// You can keep this icon here or move it to its own file if you prefer
const CommentIcon = () => (
    <svg className="w-7 h-7 text-brand-green/80 hover:text-brand-blue transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);

type PostViewProps = {
  post: Post;
};

const PostView = ({ post }: PostViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isGallery = post.media.type === 'gallery' && post.media.urls && post.media.urls.length > 1;

  // --- Carousel Navigation Functions ---
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? post.media.urls!.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === post.media.urls!.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const getCurrentImageUrl = () => {
    if (isGallery) {
      return post.media.urls![currentIndex];
    }
    return post.media.url!;
  };

  return (
    <div className="bg-white border border-brand-green/20 rounded-xl overflow-hidden max-w-2xl w-full mx-auto">
      {/* --- Post Header --- */}
      <div className="p-4 flex items-center">
        <Image
          src={post.authorImageUrl}
          alt={post.authorName}
          width={40}
          height={40}
          className="rounded-full mr-4"
        />
        <span className="font-bold text-brand-green">{post.authorName}</span>
      </div>

      {/* --- Post Media Carousel --- */}
      <div className="relative">
        <Image
          src={getCurrentImageUrl()}
          alt={`Image ${currentIndex + 1} for ${post.title}`}
          width={800}
          height={800}
          className="w-full object-cover"
        />

        {/* Navigation Arrows */}
        {isGallery && (
          <>
            <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        
        {/* Indicator Dots */}
        {isGallery && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {post.media.urls!.map((_, slideIndex) => (
              <div
                key={slideIndex}
                onClick={() => setCurrentIndex(slideIndex)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                  currentIndex === slideIndex ? 'bg-white' : 'bg-white/50'
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>
      
      {/* --- Actions Bar --- */}
      <div className="flex items-start space-x-4 p-4 border-b border-brand-green/10">
        <LikeButton postId={post.id} initialLikeCount={post.likeCount || 0} />
        <CommentIcon />
      </div>

      {/* --- Comment Section --- */}
      <CommentSection post={post} />
    </div>
  );
};

export default PostView;