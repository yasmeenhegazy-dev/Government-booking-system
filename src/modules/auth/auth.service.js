import { User } from "../../models/user/user.model.js";

export const register = async (req, res, next) => {
  try {
    const { fName, lName, email, nationalId, role, pass } = req.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      throw new Error("user already exist");
    }
    const user = new User({
      firstName: fName,
      lastName: lName,
      email: email,
      password: pass,
      role: role,
      nationalId: nationalId,
    });
    const createdUser = await user.save();
    if (createdUser) {
      return res
        .status(201)
        .json({
          message: "user added successfuly",
          success: true,
          data: createdUser,
        });
    }
  } catch (err){
    if (err){
      return res
        .status(err.status || 500)
        .json({ message: err.message, success: false });
    }
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, nationalId, password } = req.body;

    const userExist = await User.findOne({
      $or: [
        {
          $and: [
            { email: { $exists: true } },
            { email: { $ne: null } },
            { email: email },
          ],
        },
        {
          $and: [
            { nationalId: { $exists: true } },
            { nationalId: { $ne: null } },
            { nationalId: nationalId },
          ],
        },
      ],
    });
     if(!userExist) {
      return res
        .status(404)
        .json({ message: "user not exist", success: false });
    }

    if(userExist.password == password) {
      return res
        .status(200)
        .json({ message: "user login successfuly", success: true });
    }

    if(userExist.email !== email || userExist.password !== password || userExist.nationalId !== nationalId){
      return res.status(404).json({message:"invalid credentials email or password not correct" , success:false})
    }
   
  }catch(err){
    if(err){
      return res.status(err.cause || 500).json({ message:err.message , success: false });
    }
  }
};


export const forgeTPassword = async (req , res , next) =>{
  const {password , new pass}
}


