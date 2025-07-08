import Topic from "../models/Topic.js";

export const show = async (req, res) => {
    const topicId = req.params.id;
    const links = await Topic.findById(topicId);
    return res.status(200).json({ message: "Links has been showed!", links: links.links });
};

export const add = async (req, res) => {
    try {
        const topicId = req.body.topicId;
        const { info, note, kind } = req.body;
        let link = req.body.link;
        const user = req.user;
        const result = user.topics.includes(topicId);
        if (!result) {
            return res.status(404).json({ message: "Invalid TopicId!" });
        }

        if (!link.startsWith("http://") && !link.startsWith("https://") && kind==="url") {
            link = "https://" + link;
        }

        const topic = await Topic.findByIdAndUpdate(topicId, {
            $addToSet: {
                links: {
                    link, info, note, kind
                }
            }
        }, { new: true })
        return res.status(200).json({ message: "Link has been added!", links: topic.links });
    } catch (error) {
        console.log("Error", error.message);
        return res.status(500).json({ error: error.message });
    }

};

export const remove = async (req, res) => {
    try {
        const linkId = req.params.id;
        const topicId = req.body.topicId;
        let topic = await Topic.findByIdAndUpdate(topicId, {
            $pull: {
                links: { _id: linkId }
            }
        });


        if (!topic) {
            return res.status(500).json({ error: "Invalid TopicId or linkId" });
        }

        topic = await Topic.findById(topicId);
        return res.status(200).json({ message: "Link has been removed!", links: topic.links });
    } catch (error) {
        console.log("Error", error.message);
        return res.status(500).json({ error: error.message });
    }

};

export const update = async (req, res) => {

    const { newNote, info, kind } = req.body;
    let newLink = req.body.newLink;
    try {
        if (!newLink.startsWith("http://") && !newLink.startsWith("https://") && kind==="url") {
            newLink = "https://" + newLink;
        }
        const linkId = req.params.id;
        const topicId = req.body.topicId;
        let topic = await Topic.findOneAndUpdate(
            {
                _id: topicId,
                "links._id": linkId//look inside links array and find whose _id matches with linkId
            },
            {
                $set: {
                    "links.$.link": newLink,
                    "links.$.note": newNote,
                    "links.$.info": info,
                    "links.$.kind": kind
                }
            }
        );


        if (!topic) {
            return res.status(500).json({ error: "Invalid TopicId or linkId" });
        }

        topic = await Topic.findById(topicId);
        return res.status(200).json({ message: "Link has been updated!", links: topic.links });
    } catch (error) {
        console.log("Error", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const toggleMarked = async (req, res) => {
    const { status, topicId } = req.body;
    const linkId = req.params.id;
    try {
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        let link = topic.links.id(linkId);
        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }
        const currentStatus = link.marked || false;
        const updated = await Topic.updateOne(
            {
                _id: topicId,
                "links._id": linkId
            },
            {
                $set: {
                    "links.$.marked": !currentStatus
                }
            }
        );
        const updatedTopic = await Topic.findById(topicId);

        return res.status(200).json({
            message: "Marked status toggled!",
            links: updatedTopic.links
        });
    } catch (error) {
        console.log("Error", error.message);
        return res.status(500).json({ error: error.message });
    }
}