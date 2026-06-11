import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: `send message error ${error.message}` });
  }
};

export const getAllMessages = async(req,res)=>{
  try {
    const senderId = req.user;
    const receiverId = req.params.receiverId;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate('messages');
    if (!conversation) {
      return res.status(200).json([]);
    }

    return res.status(200).json(conversation.messages);

  } catch (error) {
    return res.status(500).json({message:`Error in getting all messages ${error.message}`});
  }
}

export const getPreviousChats = async (req, res) => {
  try {
    const currentUserId = req.user;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "username profilePicture") 
      .sort({ updatedAt: -1 });

    const userMap = {};

    conversations.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id.toString() !== currentUserId.toString()) {
          userMap[user._id.toString()] = user;
        }
      });
    });

    const previousUsers = Object.values(userMap);
    
    return res.status(200).json(previousUsers);

  } catch (error) {
    return res.status(500).json({ message: `Error in getting previous chat messages: ${error.message}` });
  }
};