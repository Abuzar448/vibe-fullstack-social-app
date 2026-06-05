import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

export const uploadStory = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not Found !" });
    }

    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }
    const { mediaType } = req.body;

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required !" });
    }

    const story = new Story({
      mediaType,
      media,
      author: userId,
    });

    user.story = story._id;
    await story.save();
    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username profilePicture")
      .populate("viewers", "name username profilePicture");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: "Upload Story Error !" });
  }
};

export const viewStory = async (req, res) => {
  try {
    const userId = req.user;
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(400).json({ message: "Story not Found" });
    }

    const viewersIds = story.viewers.map((id) => id.toString());
    if (!viewersIds.includes(userId.toString())) {
      story.viewers.push(userId);
    }

    await story.save();
    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username profilePicture")
      .populate("viewers", "name username profilePicture");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(200).json({ message: "Story View Error !" });
  }
};

export const getStoryByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not Found !" });
    }

    const story = await Story.find({ author: user._id })
      .populate("viewers", "name username profilePicture")
      .populate("author", "name username profilePicture");

    return res.status(200).json(story);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while checking story by username !" });
  }
};

export const allStories = async (req, res) => {
  try {
    const userId = req.user;
    const currentUser = await User.findById(userId);
    const followingIds = currentUser.following;

    const stories = await Story.find({
      author: { $in: followingIds },
    })
      .populate("author", "name username profilePicture")
      .populate("viewers", "username profilePicture")
      .sort({ createdAt: -1 }).lean();

    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: "All Stories Getting Error" });
  }
};
