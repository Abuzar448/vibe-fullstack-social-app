import jwt from "jsonwebtoken";

const isAuth = async (req,res,next)=>{
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error while checking is user loged in or not ?" });
  }
};

export default isAuth;
