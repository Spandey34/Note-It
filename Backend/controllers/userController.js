import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Topic from "../models/Topic.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.status(500).json({ error: "User already exists!" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        console.log(token);
        res.cookie("jwt", token);
        return res.status(200).json({
            message: "User created succesfully!", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                topics: []
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("topics");
    if (!user) {
        return res.status(500).json({ error: "User does not exists!" });
    }

    try {
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(500).json({ error: "Invalid Credentials!" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("jwt", token);
        return res.status(200).json({
            message: "User logged in succesfully!", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                topics: user.topics
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const logout = async (req, res) => {

    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,         
            sameSite: "None",     
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const userDetails = async (req, res) => {
    
    try {
        const user = req.user;
        const userDetails = await User.findById(user._id).select("-password");
        return res.status(200).json({ message: "Details has been showed", user: userDetails });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const update = async (req,res) => {

    try {
        const user = req.user;
        const {name,password} = req.body;
        if(password)
        {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
           const userDetails = await User.findByIdAndUpdate(user._id, {
               name: name,
               password: hashedPassword
            }).select("-password");
            return res.status(200).json({ message: "Profile has been updated!!", user: userDetails });
        }
        const userDetails = await User.findByIdAndUpdate(user._id, {
               name: name,
            });
        return res.status(200).json({ message: "Profile has been updated!!", user: userDetails });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



