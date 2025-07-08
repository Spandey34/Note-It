import React from "react";
import Login from "../pages/Login";
import Topics from "../pages/Topics";
import Links from "../pages/Links";
import { useParams } from "react-router-dom";

export default function LinksOrTopics({ authUser, selectedTopic, setSelectedTopic }) {
  if (!authUser) return (<Login />);
  if (!selectedTopic) return (<Topics selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />);
  return( <Links selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />);
}
