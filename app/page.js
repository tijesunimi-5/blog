"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FaComment, FaEyeSlash, FaHeart, FaShare, FaTrash } from "react-icons/fa";

const page = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const { setPost, post, updatePost, addPost } = useContext(PostContext);
  const isLiked = false;
  const [isFollowing, setIsFollowing] = useState(false);

  //this function is to fetch post
  useEffect(() => {
    // Load posts from localStorage on initial render
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      addPost(parsedPosts)
      setPost(parsedPosts); // Update context
      setPosts(parsedPosts); // Update local state
    }
  }, [setPost]);

  //this function is to like a single post
  const setLike = (postId, currentLikedStatus) => {
    const updatedLiked = !currentLikedStatus;

    const updatedPosts = posts.map((post) =>
      post._id === postId ? { ...post, isLiked: updatedLiked } : post
    );

    // Update state
    setPosts(updatedPosts);

    // Persist to localStorage
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };


  //this function is to toggle follow for a single post
  const toggleFollow = (postUser) => {
    // Retrieve posts from localStorage
    const storedPosts = localStorage.getItem("posts");

    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);

      // Find the post user and toggle follow
      const updatedPosts = parsedPosts.map((post) =>
        post.name === postUser
          ? { ...post, isFollowing: !post.isFollowing }
          : post
      );

      // Update the state and persist to localStorage
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    }
  };


  return (
    <section>
      {posts.length === 0 ? (
        <p className="text-center text-2xl mt-20 font-bold">
          No Post Yet Login First. (or try refreshing).....
        </p>
      ) : (
        posts.map((post, index) => (
          <Card key={index} styles={"w-[360px] mx-2 mt-3"}>
            <div className="relative flex">
              <img
                src={post.profile_picture || post.picture}
                alt={`${post.name}'s profile`}
                className="rounded-full bg-red-300 w-[90px] h-[90px] border-2 border-white overflow-hidden"
              />
              <div className="ml-4">
                <h1 className="font-extrabold text-[1.5em]">{post.name}</h1>
                <Button
                  styles={"w-[110px] mt-5"}
                  onClick={() => toggleFollow(post.name)}
                >
                  {post.isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  styles={"w-[110px] mt-5 ml-2"}
                  onClick={() => router.push(`/profile/${post.id}`)}
                >
                  See profile
                </Button>
              </div>
            </div>

            <hr className="mt-5 border-2" />
            <div>
              <span className="font-semibold font-sans text-xl">
                Best post:
              </span>
              <p className="font-mono relative w-[310px]">{post.post}</p>
            </div>

            <div className="bg-white flex justify-between overflow-hidden rounded w-[355px] py-2 px-5 ml-[-10px]">
              <Button
                styles={`btn flex text-white px-2`}
                onClick={() => setLike(post._id, post.isLiked)}
              >
                {post.isLiked ? "Liked" : "Like"}{" "}
                <FaHeart className={`like m-1 ml-1`} />
              </Button>

              <Button styles={"flex text-white px-1"}>
                Comment <FaComment className="text-white m-1 ml-1" />
              </Button>

              {/* <Button
                styles={"flex text-white px-1"}
                onClick={() => deletePost(post._id)}
              >
                Hide
                <FaEyeSlash className="m-1 ml-1" />
              </Button> */}
            </div>

            <div id="comment" className=""></div>
          </Card>
        ))
      )}
    </section>
  );
};

export default page;
