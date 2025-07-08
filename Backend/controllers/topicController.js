import Topic from "../models/Topic.js";
import User from "../models/User.js";

export const addTopic = async (req,res) => {
      const name = req.body.name;
      const user = req.body.user;
      try {
        const topic = await Topic.create({
        name: name || "undefined"
      });
      //console.log(topic);
      const updatedTopic = await User.findByIdAndUpdate(user._id,{
          $addToSet: {
            topics: topic._id
          }
      }, { new: true }).populate("topics").select("-password");
      return res.status(201).json({ message: "Topic has been added!", user: updatedTopic});
      } catch (error) {
        console.log("error", error.message);
        return res.status(500).json({error: "Error in adding Topic"});
      }
      
};

export const showTopics = async (req,res) => {
    try {
    const user = req.user;
    
    const topics = await User.findById(user._id).populate("topics").select("topics");
    return res.status(200).json({ message: "Topics has been showed!", topics: topics.topics}) 
    } catch (error) {
        console.log("error",error.message)
        return res.status(500).json({error: "Error in loading Topics"}, error.message)
    }
    
};

export const renameTopic = async (req,res) => {
    try {
    const topicId = req.params.id;
    const user = req.user;
    const { newName } = req.body;
    const result = user.topics.includes(topicId);
    if(!result)
    {
      return res.status(404).json({ message: "Invalid TopicId!"});
    }
    const updatedTopic = await Topic.findByIdAndUpdate(topicId, {
      name: newName
    }, { new: true });
    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    const topics = await User.findById(user._id).populate("topics").select("topics");
    // console.log(topics);
    return res.status(200).json({ message: "Topic has been renamed!", topics: topics.topics}) 
    } catch (error) {
        console.log("error",error.message)
        return res.status(500).json({error: "Error in renaming Topic"}, error.message)
    }
};

export const deleteTopic = async (req,res) => {
    try {
    const topicId = req.params.id;
    const user = req.user;
    const result = user.topics.includes(topicId);
    if(!result)
    {
      return res.status(404).json({ message: "Invalid TopicId!"});
    }
    await Topic.findByIdAndDelete(topicId);
    const topics = await User.findById(user._id).populate("topics").select("topics");
    return res.status(200).json({ message: "Topic has been deleted!", topics: topics.topics}) 
    } catch (error) {
        console.log("error",error.message)
        return res.status(500).json({error: "Error in deleting Topic"}, error.message)
    }
};

export const getTopic = async (req,res) => {
    try {
    const topicId = req.params.id;
    const user = req.user;
    const result = user.topics.includes(topicId);
    if(!result)
    {
      return res.status(404).json({ message: "Invalid TopicId!"});
    }
    const topic = await Topic.findById(topicId);
    return res.status(200).json({ message: "Topic has been fetched!", topic: topic}) 
    } catch (error) {
        console.log("error",error.message)
        return res.status(500).json({error: "Error in getting Topic"}, error.message)
    }
}
