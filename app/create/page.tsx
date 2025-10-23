"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Travel');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    // Create previews
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!title.trim() || !excerpt.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (files.length === 0) {
      setError('Please select at least one image or video');
      return;
    }

    setUploading(true);

    try {
      // Upload files to Firebase Storage
      const uploadPromises = files.map(async (file) => {
        const fileRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      });

      const urls = await Promise.all(uploadPromises);

      // Create post document
      const postData = {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        authorName: user.displayName || 'Anonymous',
        authorImageUrl: user.photoURL || '',
        authorId: user.uid,
        category,
        media: {
          type: urls.length > 1 ? 'gallery' : 'image',
          url: urls.length === 1 ? urls[0] : undefined,
          urls: urls.length > 1 ? urls : undefined,
        },
        publishedAt: serverTimestamp(),
        likeCount: 0,
      };

      await addDoc(collection(db, 'posts'), postData);

      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-brand-green/20 p-6">
        <h1 className="text-3xl font-bold text-brand-green mb-6">Create New Post</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-brand-green mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Caption/Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-brand-green mb-2">
              Caption *
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 border border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              rows={4}
              placeholder="Share your thoughts..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-brand-green mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="Travel">Travel</option>
              <option value="Adventure">Adventure</option>
              <option value="Food">Food</option>
              <option value="Nature">Nature</option>
              <option value="Culture">Culture</option>
              <option value="Photography">Photography</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="files" className="block text-sm font-semibold text-brand-green mb-2">
              Photos/Videos *
            </label>
            <input
              type="file"
              id="files"
              onChange={handleFileChange}
              accept="image/*,video/*"
              multiple
              className="w-full px-4 py-2 border border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-green file:text-white file:cursor-pointer hover:file:bg-brand-green/90"
            />
            <p className="text-sm text-brand-green/60 mt-1">
              You can select multiple images or videos
            </p>
          </div>

          {/* Preview */}
          {previews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-brand-green mb-2">Preview</h3>
              <div className="grid grid-cols-2 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-brand-blue/90 transition-colors font-semibold disabled:bg-brand-green/50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Publishing...' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-brand-green/30 text-brand-green rounded-lg hover:bg-brand-green/5 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
