import {User} from '../models/model.user.js';

export const getAllUsers=async(req,res)=>{
    try {
        const userId=req.userId;
        const users = await User.find({ _id: { $ne: userId } }).select("-password");
        return res.status(200).json({
            success:true,
            users,
            message:"Users fetched successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}