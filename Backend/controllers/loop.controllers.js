import uploadOnCloudinary from "../config/cloudinary.js";
import Reel from "../models/reels.model.js";
import User from "../models/user.model.js";
import { io } from "../socket.js";


export const uploadLoop = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not Found!" });
    }

    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media is required!" });
    }

    const reel = new Reel({
      caption,
      media,
      author: userId,
    });
    await reel.save();

    user.reels.push(reel._id);
    await user.save();

    await reel.populate("author", "name username profilePicture");

    return res.status(201).json(reel);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while uploading the reel on vibe !" });
  }
};

export const myReels = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not Found !" });
    }

    const allReels = await Reel.find({ author: userId }).populate(
      "author",
      "name username profilePicture",
    );

    return res.status(200).json(allReels);
  } catch (error) {
    return res.status(500).json({ message: "Error in fetching all Reels !" });
  }
};

export const like = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not Found !" });
    }

    const reelId = req.params.reelId;
    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(400).json({ message: "Reel not Found !" });
    }

    const isLiked = reel.likes.includes(userId);
    if (isLiked) {
      reel.likes.pull(userId);
    } else {
      reel.likes.push(userId);
    }

    await reel.save();
    await reel.populate("author", "name username profilePicture");

    io.emit("likedLoop", {
      reelId: reel._id,
      likes: reel.likes,
    });

    return res.status(200).json(reel);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occured while liking the reel !" });
  }
};

export const comment = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not Found !" });
    }
    const reelId = req.params.reelId;
    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(400).json({ message: "Reel is not Found !" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required !" });
    }

    reel.comments.push({
      author: userId,
      message,
    });
    await reel.save();

    await reel.populate([
      {
        path: "author",
        select: "name username profilePicture",
      },
      {
        path: "comments.author",
        select: "name username profilePicture",
      },
    ]);

    io.emit("commentedLoop", {
      reelId: reel._id,
      comments: reel.comments,
    });

    return res.status(201).json(reel);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while commenting on Reel !" });
  }
};

export const allReels = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not Found !" });
    }

    const allReels = await Reel.find({})
      .populate("author", "name username profilePicture")
      .populate("comments.author", "name username profilePicture");

    return res.status(200).json(allReels);
  } catch (error) {
    return res.status(500).json({ message: "Error in fetching all Reels !" });
  }
};
