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

const ShareIcon = () => (
    <svg className="w-7 h-7 text-brand-green/80 hover:text-brand-blue transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
);

type PostViewProps = {
  post: Post;
};

const PostView = ({ post }: PostViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(true);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white border border-brand-green/20 rounded-xl overflow-hidden max-w-2xl w-full mx-auto shadow-sm hover:shadow-md transition-shadow">
      {/* --- Post Header --- */}
      <div className="p-4 flex items-center">
        <Image
          src={post.authorImageUrl}
          alt={post.authorName}
          width={40}
          height={40}
          className="rounded-full mr-4"
        />
        <div className="flex-1">
          <p className="font-bold text-brand-green">{post.authorName}</p>
          <p className="text-xs text-brand-green/60">{post.category}</p>
        </div>
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
      <div className="flex items-start justify-between p-4 border-b border-brand-green/10">
        <div className="flex items-start space-x-4">
          <LikeButton postId={post.id} initialLikeCount={post.likeCount || 0} />
          <div onClick={() => setShowComments(!showComments)}>
            <CommentIcon />
          </div>
          <div onClick={handleShare}>
            <ShareIcon />
          </div>
        </div>
      </div>

      {/* --- Comment Section --- */}
      {showComments && <CommentSection post={post} />}
    </div>
  );
};

export default PostView;