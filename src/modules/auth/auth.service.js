import { User } from "../../models/user/user.model.js";
import { sendMail } from "../../services/email/sendmail.service.js";
import { generateCodeOtp } from "../../services/otp/otp.service.js";

export const register = async (req, res, next) => {
  try {
    const { fName, lName, email, nationalId, role, pass } = req.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      throw new Error("user already exist");
    }

    // prepare data >> hash password
    const user = new User({
      firstName: fName,
      lastName: lName,
      email: email,
      password: pass,
      role: role,
      nationalId: nationalId,
    });
    // verification code

    // await sendMail({
    //   to: user.email,
    //   subject: "Verify your account",
    //   html: `<p> your otp to verify your account is </p> ${generateCodeOtp(6)}`,
    // });

    const createdUser = await user.save();
    if (createdUser) {
      return res.status(201).json({
        message: "user added successfuly",
        success: true,
        data: createdUser,
      });
    }
  } catch (err) {
    if (err) {
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
    if (!userExist) {
      return res
        .status(404)
        .json({ message: "user not exist", success: false });
    }

    if (userExist.password == password) {
      return res
        .status(200)
        .json({ message: "user login successfuly", success: true });
    }

    if (
      userExist.email !== email ||
      userExist.password !== password ||
      userExist.nationalId !== nationalId
    ) {
      return res.status(404).json({
        message: "invalid credentials email or password not correct",
        success: false,
      });
    }
  } catch (err) {
    if (err) {
      return res
        .status(err.cause || 500)
        .json({ message: err.message, success: false });
    }
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { nationalId } = req.body;
    const { otp, otpExpire } = generateCodeOtp(6);

    const userExist = await User.findOneAndUpdate(
      { nationalId },
      { otp, otpExpire },
    );

    if (!userExist) {
      return res
        .status(404)
        .json({ message: "user not exist", success: false });
    }

    await sendMail({
      to: userExist.email,
      subject: "Recover your account",
      html: `<p>Your OTP to verify your account is:</p> <h2>${otp}</h2>`,
    });

    userExist.otp = otp;
    userExist.otpExpire = otpExpire;
    return res
      .status(200)
      .json({ message: "otp sended successfuly", success: true });
  } catch (err) {
    return res
      .status(err.cause || 500)
      .json({ message: err.message, success: false });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { otp, email, newPassword } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res
        .status(404)
        .json({ message: "user not exist", success: false });
    }

    if (userExist.otp != otp) {
      throw new Error("invalid otp", { cause: 400 });
    }
    if (userExist.otpExpire < Date.now()) {
      throw new Error("otp expired", { cause: 400 });
    }

    userExist.password = newPassword;
    userExist.otp = null;
    userExist.otpExpire = null;

    await userExist.save();

    return res
      .status(200)
      .json({ message: "Password reset successfuly", success: true });
  } catch (err) {
    return res
      .status(err.cause || 500)
      .json({ message: err.message, success: false });
  }
};
