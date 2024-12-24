"use client";
import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Ensuring the code runs only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Corrected to use JSON.parse
      }
    }
  }, []);

  // Update localStorage whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Corrected to use JSON.stringify
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Function to update user data in context and localStorage
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
