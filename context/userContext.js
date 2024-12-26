"use client";
import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Ensuring the code runs only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        console.log("Retrieved user from localStorage:", storedUser);
        setUser(JSON.parse(storedUser));
      }
      const allStoredUser = localStorage.getItem("users");
      if (allStoredUser) {
        setAllUsers(JSON.parse(allStoredUser));
      }
    }
  }, []);

  // Update localStorage whenever the user state changes
  useEffect(() => {
    if (user) {
      console.log("Saving user to localStorage:", user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      console.log("Removing user from localStorage");
      localStorage.removeItem("user");
    }

    if (allUsers) {
      localStorage.setItem("Users update:", JSON.stringify(allUsers));
      console.log("updating state to local storage:", allUsers);
    } else {
      console.log("Removing user:");
      localStorage.removeItem("users");
    }
  }, [user, allUsers]);

  // Function to update user data in context and localStorage
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
  };

  const updateAllUsers = (updatedUser) => {
    setAllUsers((prevUser) => ({ ...prevUser, ...updatedUser}))
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logout, allUsers, setAllUsers, updateAllUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
