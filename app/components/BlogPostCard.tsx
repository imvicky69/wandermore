import Link from 'next/link';
import Image from 'next/image'; // We'll use Next.js's optimized Image component

// Let's define a type for our blog post props for better code quality
type BlogPostCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  authorName: string;
  authorImageUrl: string;
  category: string;
};

const BlogPostCard = ({
  slug,
  title,
  excerpt,
  imageUrl,
  authorName,
  authorImageUrl,
  category,
}: BlogPostCardProps) => {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out group">
      <Link href={`/blog/${slug}`}>
        <div className="relative">
          {/* Blog Post Image */}
          <Image
            src={imageUrl}
            alt={`Image for ${title}`}
            width={800}
            height={400}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {/* Category Tag */}
          <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
        <div className="p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h2>
          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
          
          {/* Author Info */}
          <div className="flex items-center">
            <Image
              src={authorImageUrl}
              alt={authorName}
              width={40}
              height={40}
              className="rounded-full mr-4"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">{authorName}</p>
              <p className="text-xs text-gray-500">Published on Oct 22, 2025</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogPostCard;