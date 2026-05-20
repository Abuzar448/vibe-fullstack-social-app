import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected Successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;
