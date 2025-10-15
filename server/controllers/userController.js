import User from "../models/User.js";
import fs from "fs";
import imagekit from "../configs/imageKits.js";
import Connection from "../models/connection.js";

// Get user data using userid
export const getUserData = async (req, res) => {
  try {
    const { userID } = await req.auth();
    const user = await User.findById(userID);
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
      return; // Prevents sending multiple responses
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update user data using userid
export const updateUserData = async (req, res) => {
  try {
    const { userID } = await req.auth();
    let { full_name, username, bio, location } = req.body;

    const TempUser = await User.findById(userID);

    !username && (username = TempUser.username);

    if (TempUser.username !== username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        //   Username already exists and belongs to a different user
        username = TempUser.username;
      }
    }

    let updatedData = {
      username,
      bio,
      location,
      full_name,
    };
    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: `${Date.now()}-${profile.originalname}`,
      });

      const url = imagekit.url({
        src: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        src: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }
    const user = await User.findByIdAndUpdate(userID, updatedData, {
      new: true,
    });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// find users by name, username , email, location
export const discoverUsers = async (req, res) => {
  try {
    const { userID } = await req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { full_name: new RegExp(input, "i") },
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = allUsers.filter(
      (user) => user._id.toString() !== userID
    );
    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// follow user
export const followUser = async (req, res) => {
  try {
    const { userID } = await req.auth();
    const { id } = req.body;
    const user = await User.findById(userID);
    if (!user.following) user.following = [];
    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }
    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    if (!toUser.followers) toUser.followers = [];
    toUser.followers.push(userID);
    await toUser.save();
    res.json({ success: true, message: "You are now following this user" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const { userID } = await req.auth();
    const { id } = req.body;
    const user = await User.findById(userID);

    if (!user.following) user.following = [];
    user.following = user.following.filter((userId) => userId !== id);
    await user.save();

    const toUser = await User.findById(id);
    if (!toUser.followers) toUser.followers = [];
    toUser.followers = toUser.followers.filter((userId) => userId !== userID);
    await toUser.save();

    res.json({ success: true, message: "You are now unfollowing this user" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userID } = await req.auth();
    const { id } = req.body;
    // check if the user have sent more than 20 connection request in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userID,
      created_at: { $gt: last24Hours },
    });
    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message:
          "you have sent more than 20 connection requests in the last 24 hours ",
      });
    }

    // check if users are already connected
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userID, to_user_id: id },
        { from_user_id: id, to_user_id: userID },
      ],
    });
    if (connection) {
      await Connection.create({
        from_user_id: userID,
        to_user_id: id,
      });
      return res.json({
        success: true,
        message: "connection request sent successfully",
      });
    } else if (connection && connection.status === "accepted") {
      return res.json({
        success: false,
        message: "you are already connected to this user",
      });
    }
    return res.json({
      success: false,
      message: "connetion request pending",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get user connection
export const getUserConnections = async (req, res) => {
  try {
    const { userID } = await req.auth();
    const user = await User.findById(userID).populate(
      "connections followers following"
    );

    const connections = user.connections;
    const followers = user.followers;
    const following = user.following;

    const pendingConnections = await Connection.find({
      to_user_id: userID,
      status: "pending",
    })
      .populate("from_user_id")
      .map((connection) => connection.from_user_id);

    res.json({
      success: true,
      connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userID } = await req.auth();
    const { id } = req.body;

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userID,
    });

    if (!connection) {
      return res.json({ success: false, message: "connection not found" });
    }

    const user = await User.findById(userID);
    user.connections.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.connections.push(userID);
    await toUser.save();

    connection.status = "accepted";
    await connection.save();

    res.json({ success: true, message: "connection accepted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
