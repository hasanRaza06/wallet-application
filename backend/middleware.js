import jwt from 'jsonwebtoken';

export const generateToken=(user)=>{
    const token=jwt.sign({
        userId:user._id,
    },process.env.JWT_PASSWORD,{expiresIn:'15d'});
    return token;
}

export const userMiddleWare=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: "Forbidden: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
      req.userId = decoded.userId; 
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  }