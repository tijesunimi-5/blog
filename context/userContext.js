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
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (allUsers) {
      localStorage.setItem("Users update:", JSON.stringify(allUsers));
    } else {
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
