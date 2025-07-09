import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Topic from "../models/Topic.js";
import cloudinary from "../cloudinary/cloudinaryConfig.js";

// ✅ Helper: Create JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Signup controller
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ error: "User already exists!" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "User created successfully!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        topics: [],
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("topics");

  if (!user) {
    return res.status(400).json({ error: "User does not exist!" });
  }

  try {
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).json({ error: "Invalid Credentials!" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "User logged in successfully!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        topics: user.topics,
        photoUrl: user.photoUrl
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Logout (optional now — no cookie to clear)
export const logout = async (req, res) => {
  // LocalStorage-based JWT logout is just clearing the token on frontend
  return res.status(200).json({ message: "Logged out on client side" });
};

// ✅ Get user details (protected route)
export const userDetails = async (req, res) => {
  try {
    const user = req.user;
    const userDetails = await User.findById(user._id).select("-password");
    return res.status(200).json({ message: "User details retrieved", user: userDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Update user profile
export const update = async (req, res) => {
  try {
    const user = req.user;
    const { name, password } = req.body;
    let profilePicUrl = user.photoUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
        width: 150,
        height: 150,
        crop: 'fill'
      });
      profilePicUrl = result.secure_url;
    }

    const updateData = {
      name: name,
      photoUrl: profilePicUrl
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const userDetails = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({ 
      message: "Profile has been updated!!", 
      user: userDetails 
    });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
