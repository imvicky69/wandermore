// 1. IMPORT THE NEW POSTVIEW COMPONENT (remove BlogPostCard import)
import PostView from "./components/PostView";
import { db } from "../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

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
    // We create a single-column feed with spacing between posts
    <div className="flex flex-col items-center space-y-8">
      {posts.map((post) => (
        <PostView key={post.id} post={post} />
      ))}
    </div>
  );
}