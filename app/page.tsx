// 1. IMPORT THE NEW POSTVIEW COMPONENT (remove BlogPostCard import)
import PostView from "./components/PostView";
import { db } from "../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";

// The Post type definition remains the same and is still useful
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  authorImageUrl: string;
  category: string;
  media: {
    type: 'image' | 'video' | 'gallery';
    url?: string;
    urls?: string[];
  };
  publishedAt: Timestamp;
  likeCount?: number;
};

// The getPosts function remains the same, it works perfectly
async function getPosts(): Promise<Post[]> {
  const postsCollectionRef = collection(db, "posts");
  const q = query(postsCollectionRef, orderBy("publishedAt", "desc"));
  const querySnapshot = await getDocs(q);

  const posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    posts.push({ id: doc.id, ...data } as Post);
  });
  return posts;
}


// 2. UPDATE THE HOME COMPONENT'S LAYOUT
export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center max-w-md">
            <svg 
              className="w-24 h-24 mx-auto mb-6 text-brand-green/30" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-brand-green mb-3">
              No posts yet
            </h2>
            <p className="text-brand-green/70 mb-6">
              Be the first to share your journey! Create a post to get started.
            </p>
            <Link 
              href="/create"
              className="inline-block bg-brand-blue text-white px-8 py-3 rounded-lg hover:bg-brand-blue/90 transition-colors font-semibold"
            >
              Create Your First Post
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8">
          {posts.map((post) => (
            <PostView key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}