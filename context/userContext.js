"use client";
import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("users");
      return storedUsers ? JSON.parse(storedUsers) : [];
    }
    return [];
  });

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Sync user with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Sync allUsers with localStorage
  useEffect(() => {
    if (allUsers?.length > 0) {
      localStorage.setItem("users", JSON.stringify(allUsers));
    }
  }, [allUsers]);

  // Function to update a specific user
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
  };

  // Function to update a user in the allUsers array
  const updateAllUsers = (updatedUser) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === updatedUser.userId ? { ...user, ...updatedUser } : user
      )
    );
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
        allUsers,
        setAllUsers,
        updateAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
