import fs from "fs";
import imagekit from "../configs/imageKits.js";
import Post from "../models/post.js";
import User from "../models/User.js";

// Add post
export const addPost = async (req, res) => {
  try {
    const { userid } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files;

    let image_urls = [];
    if (images.length) {
      image_urls = await promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });

          const url = imagekit.url({
            src: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });
          return url;
        })
      );
    }
    await Post.create({
      user: userid,
      content,
      image_urls,
      post_type,
    });
    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get post
export const getFeedPosts = async (req, res) => {
  try {
    const { userid } = req.auth();
    const user = User.findById(userid);

    // User connections and following
    const userIds = [userid, ...user.connections, user.following];
    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ success: true, message: posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Like post
export const likePost = async (req, res) => {
  try {
    const { userid } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (post.likes_count.includes(userid)) {
      post.likes_count = post.likes_count.filter((user) => user != userid);
      await post.save();
      res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes_count.push(userid);
      await post.save();
      res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
