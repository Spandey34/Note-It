import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
    }],
    photoUrl: {
        type: String,
        default: ""
    }
});

const User = mongoose.model("User", userSchema);

export default User