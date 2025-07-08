import React from "react";
import Login from "./pages/Login";
import Topics from "./pages/Topics";
import { Links, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { useState } from "react";
import Profile from "./pages/Profile";
import LinksOrTopics from "./components/LinksOrTopics";

function App() {
  const [authUser, setAuthUser] = useAuth();
  const [selectedTopic, setSelectedTopic] = useState({});

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={authUser ? <Profile /> : <Login />}
        />

        <Route
          path="/topics"
          element={
            authUser ? (
              <Topics
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/"
          element={authUser ? <Profile /> : <Login />}
        />

        <Route
          path="/links/:topicId"
          element={
            <LinksOrTopics
              authUser={authUser}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
            />
          }
        />

      </Routes>
      {/* <Profile user={user} onEdit={handleEdit} />; */}
    </>
  );
}

export default App;
