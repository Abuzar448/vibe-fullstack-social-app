import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).populate('posts').populate('posts reels posts.author posts.comments saved saved.author');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error while getting current User." });
  }
};

const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { name, username, bio, profession, gender } = req.body;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found " });
    }
    const sameUserwithUsername = await User.findOne({ username }).select(
      "-password"
    );
    if (sameUserwithUsername && sameUserwithUsername._id.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Username Already Exists" });
    }

    let profileImage;
    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
      user.profilePicture = profileImage;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.profession = profession || user.profession;
    user.bio = bio || user.bio;
    user.gender = gender || user.gender;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`editing failed due to ${error}`);
  }
};

const getProfile = async (req,res)=>{
  try {
    const username = req.params.username;
    const user = await User.findOne({username}).select('-password').populate('posts reels followers following saved saved.author');
    if(!user){
      return res.status(400).json({message:'User Not Found'})
    }
    
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({message:"Getting Profile Error."})
  }
}

export { getCurrentUser, suggestedUsers, editProfile, getProfile };
