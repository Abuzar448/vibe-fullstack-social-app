import { response } from "express";
import uploadOnCloudinary from "../config/cloudinary.js";
import isAuth from "../middlewares/isAuth.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { io } from "../socket.js";

export const uploadPost = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    const { caption, mediaType } = req.body;

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required !" });
    }

    const post = new Post({
      caption,
      mediaType,
      media,
      author: userId,
    });
    await post.save();

    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name username profilePicture",
    );
    return res.status(201).json(populatedPost);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Upload Post Error!", error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    const allPosts = await Post.find({ author: userId }).populate(
      "author",
      "name username profilePicture",
    );

    return res.status(200).json(allPosts);
  } catch (error) {
    return res.status(500).json({ message: "Fetching All Posts Error !" });
  }
};

export const like = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user not found !" });
    }

    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found !" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() == userId.toString(),
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    await post.populate([
      { path: "author", select: "name username profilePicture" },
      { path: "comments.author", select: "name username profilePicture" },
    ]);

    io.emit("likedPost", {
      postId: post._id,
      likes: post.likes,
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Like Post Error !" });
  }
};

export const comment = async (req, res) => {
  try {
    const userId = req.user;
    const postId = req.params.postId;

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required!" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not Found !" });
    }

    post.comments.push({
      author: userId,
      message,
    });
    await post.save();
    const fullPopulatedPost = await Post.findById(postId)
      .populate({ path: "author", select: "username profilePicture" })
      .populate({ path: "comments.author", select: "username profilePicture" })
      .sort({ createdAt: -1 });

    io.emit("commentedPost", {
      postId: post._id,
      comments: post.comments,
    });

    return res.status(200).json(fullPopulatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Post Comment creation Error !" });
  }
};

export const savedPost = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user not found !" });
    }

    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found !" });
    }

    const isSaved = user.saved.some(
      (id) => id.toString() === postId.toString(),
    );
    if (isSaved) {
      user.saved.pull(postId);
    } else {
      user.saved.push(postId);
    }

    await user.save();

    return res.status(202).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error while saving the post !" });
  }
};

export const allPosts = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    const posts = await Post.find({})
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments.author",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Fetching All Posts Error !" });
  }
};

export const Follow = async (req, res) => {
  try {
    const userId = req.user;
    const postUserId = req.params.id;

    if (userId === postUserId) {
      return res.status(400).json({ message: "You can not follow yourself" });
    }

    const user = await User.findById(userId);
    const postUser = await User.findById(postUserId);

    if (!user || !postUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isFollowing = user.following.includes(postUserId);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne({ _id: userId }, { $pull: { following: postUserId } }),
        User.updateOne({ _id: postUserId }, { $pull: { followers: userId } }),
      ]);
    }

    if (!isFollowing) {
      await Promise.all([
        User.updateOne({ _id: userId }, { $push: { following: postUserId } }),
        User.updateOne({ _id: postUserId }, { $push: { followers: userId } }),
      ]);
    }

    await user.save();
    await postUser.save();

    const updatedUser = await User.findById(userId)
      .populate({ path: "following", select: "-password" })
      .populate({ path: "followers", select: "-password" })
      .populate({ path: "saved", select: "-password" }); // Agar saved posts bhi dikhani ho

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
