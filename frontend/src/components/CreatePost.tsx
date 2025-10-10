import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Image, Video, FileText, Send } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Post } from '@/types';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    setIsPosting(true);
    try {
      const response = await api.post('/posts', {
        content,
        visibility: 'public'
      });
      
      onPostCreated(response.data.post);
      setContent('');
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex space-x-3">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
            {user && getInitials(user.firstName, user.lastName)}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
            rows={3}
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-4">
              <button type="button" className="flex items-center text-gray-600 hover:text-primary-600">
                <Image className="w-5 h-5 mr-1" />
                <span className="text-sm">Photo</span>
              </button>
              <button type="button" className="flex items-center text-gray-600 hover:text-primary-600">
                <Video className="w-5 h-5 mr-1" />
                <span className="text-sm">Video</span>
              </button>
              <button type="button" className="flex items-center text-gray-600 hover:text-primary-600">
                <FileText className="w-5 h-5 mr-1" />
                <span className="text-sm">Document</span>
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isPosting || !content.trim()}
              className="btn-primary flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
