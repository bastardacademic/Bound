import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: { username: string; avatarUrl: string };
  tags?: { tagId: string; label?: string }[];
  visibility: string;
  flair?: string;
}

interface FeedContainerProps {
  endpoint: string;
  title?: string;
}

const FeedContainer: React.FC<FeedContainerProps> = ({ endpoint, title }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(/api/feeds/)
      .then((res) => {
        setPosts(res.data.posts);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load feed.');
        setLoading(false);
      });
  }, [endpoint]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-muted p-4 rounded-xl shadow">
              <div className="flex items-center mb-2 gap-2">
                <img src={post.author.avatarUrl} className="w-6 h-6 rounded-full" />
                <span className="font-medium">@{post.author.username}</span>
                {post.flair && <span className="text-sm text-foreground/60 ml-2">[{post.flair}]</span>}
              </div>
              <div>{post.content}</div>
              <div className="text-xs text-muted-foreground mt-1">{new Date(post.createdAt).toLocaleString()}</div>
              {post.tags && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.tagId}
                      className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full"
                    >
                      #{tag.label || tag.tagId}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedContainer;
