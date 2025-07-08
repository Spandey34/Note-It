// LoadingContext.js
import React, { createContext, useContext, useState } from "react";
import Loader from "../components/Loader"; // Your loader animation component

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <Loader />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider
