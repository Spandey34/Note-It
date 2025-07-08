import mongoose from "mongoose";

const topicSchema = mongoose.Schema({
    name: {
        type: String,
        default: "Undefined"
    },
    links: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            link: {
                type: String,
                required: true
            },
            info: {
                type: String,
                required: true
            },
            note: {
                type: String,
                default: ""
            },
            marked: {
                type: Boolean,
                default: false
            },
            kind: {
                type: String,
                default: "url"
            }
        }
    ]
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic