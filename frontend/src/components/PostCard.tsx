import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '@/types';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id || ''));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${post._id}/like`);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.post(`/posts/${post._id}/comment`, { text: comment });
      setComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="card">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex space-x-3">
          <Link to={`/profile/${post.author._id}`}>
            {post.author.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {getInitials(post.author.firstName, post.author.lastName)}
              </div>
            )}
          </Link>
          
          <div>
            <Link to={`/profile/${post.author._id}`} className="font-semibold text-gray-900 hover:underline">
              {post.author.firstName} {post.author.lastName}
            </Link>
            <p className="text-sm text-gray-600">{post.author.headline}</p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="px-4 pb-3">
          {post.media.map((media, index) => (
            <img
              key={index}
              src={media.url}
              alt="Post media"
              className="w-full rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
        <span>{likesCount} likes</span>
        <span>{post.comments.length} comments • {post.shares.length} shares</span>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-around">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            isLiked ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">Like</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <form onSubmit={handleComment} className="mt-4 flex space-x-3">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                {user && getInitials(user.firstName, user.lastName)}
              </div>
            )}
            
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
          </form>

          {/* Display Comments */}
          <div className="mt-4 space-y-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                {comment.user.profilePicture ? (
                  <img
                    src={comment.user.profilePicture}
                    alt={`${comment.user.firstName} ${comment.user.lastName}`}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(comment.user.firstName, comment.user.lastName)}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <Link to={`/profile/${comment.user._id}`} className="font-semibold text-sm hover:underline">
                      {comment.user.firstName} {comment.user.lastName}
                    </Link>
                    <p className="text-sm text-gray-900">{comment.text}</p>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatDate(comment.createdAt)}</span>
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
