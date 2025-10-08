import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const PostWithHashTag = post.content.replace(
    /(#\w+)/g,
    "<span class='text-indigo-600'>$1</span>"
  );

  const [likes, setLikes] = useState(post.likes_count);
  const currentUser = dummyUserData;

  const handleLike = async () => {
    // if (likes.includes(currentUser._id)) {
    //   setLikes(likes.filter((id) => id !== currentUser._id));
    // } else {
    //   setLikes([...likes, currentUser._id]);
    // }
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* user info */}
      <div
        onClick={() => navigate(`/profile/` + post.user._id)}
        className="inline-flex items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user.profile_picture}
          alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover border border-white"
        />
        <div className="text-sm font-medium text-gray-900">
          <div className="flex items-center gap-1">
            <span>{post.user.full_name}</span>
            <BadgeCheck className=" h-4 w-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} . {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Post content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: PostWithHashTag }}
        />
      )}
      {/*  // Images */}
      <div className="grid grid-cols-1 gap-2">
        {post.image_urls.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Post image ${index + 1}`}
            className={`w-full h-48 rounded-lg object-cover ${
              post.image_urls.length === 1 && "col-span-1 h-auto"
            }`}
          />
        ))}
      </div>
      {/* Post actions */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300 ">
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`h-4 w-4 cursor-pointer ${
              likes.includes(currentUser._id) && "text-red-500 fill-red-500"
            }`}
          />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4 cursor-pointer" />
          <span>{12}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="h-4 w-4 cursor-pointer" />
          <span>{7}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
