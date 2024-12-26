"use client";
import React, { createContext, useEffect, useState } from "react";

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const [post, setPost] = useState([]);

  // Load posts from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPosts = localStorage.getItem("posts");
      if (storedPosts) {
        setPost(JSON.parse(storedPosts));
      }
    }
  }, []);

  // Persist posts to localStorage whenever they are updated
  useEffect(() => {
    if (post) {
      localStorage.setItem("posts", JSON.stringify(post));
    }
  }, [post]);

  // Update a specific post in the state and persist changes
  const updatePost = (updatedPost) => {
    setPost((prevPost) =>
      prevPost.map((p) =>
        p.postId === updatedPost.postId ? { ...p, ...updatedPost } : p
      )
    );
  };

  // Add a new post to the state and persist changes
  const addPost = (newPost) => {
    setPost((prevPost) => [...prevPost, newPost]);
  };

  return (
    <PostContext.Provider value={{ post, setPost, updatePost, addPost }}>
      {children}
    </PostContext.Provider>
  );
};

export { PostContext, PostProvider };
