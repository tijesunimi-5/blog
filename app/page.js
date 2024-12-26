"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FaComment, FaHeart, FaShare, FaTrash } from "react-icons/fa";

const page = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const { allUsers, updateAllUsers } = useContext(UserContext);
  const { setPost, post, updatePost } =
    useContext(PostContext);
  const isLiked = false;
  const [isFollowing, setIsFollowing] = useState(false);



  //this function is to fetch post
  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    
    const fetchPosts = () => {
      if (storedPosts) {
        setPost(JSON.parse(storedPosts));
        setPosts(post);
        return;
      } else {
        // Fallback: Fetch from server if localStorage is empty
        // fetchPosts();
      }
    };

    fetchPosts();
  }, []);



  //this function is to like a single post
  // const setLike = async (postId, currentLikedStatus) => {
  //   try {
  //     const updatedLiked = !currentLikedStatus;

  //     const res = await fetch("/api/post-apis/updatePostStatus-api", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         postId,
  //         isLiked: updatedLiked,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       setPosts((prevPosts) =>
  //         prevPosts.map((post) =>
  //           post.postId === postId ? { ...post, isLiked: updatedLiked } : post
  //         )
  //       );
  //     } else {
  //       console.error("Failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Failed:", error);
  //   }
  // };
  const setLike = (postId, currentLikedStatus) => {
    const updatedLiked = !currentLikedStatus;

    const updatedPosts = posts.map((post) =>
      post.postId === postId ? { ...post, isLiked: updatedLiked } : post
    );

    updatePost({ postId, isLiked: updatedLiked });
    setPosts(post)
    // setPostsAndPersist(updatedPosts);
  };



  return (
    <section>
      {posts.length === 0 ? (
        <p className="text-center text-3xl font-bold">No Post Yet......</p>
      ) : (
        posts.map((post, index) => (
          <Card key={index} styles={"w-[360px] mx-2 mt-3"}>
            <div className="relative flex">
              <img
                src={post.picture}
                alt={`${post.name}'s profile`}
                className="rounded-full bg-red-300 w-[90px] h-[90px] border-2 border-white overflow-hidden"
              />
              <div className="ml-4">
                <h1 className="font-extrabold text-[1.5em]">{post.name}</h1>
                <Button styles={"w-[110px] mt-5"}>
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

            <div className="bg-white flex justify-between overflow-hidden rounded w-[355px] py-2 px-1 ml-[-10px]">
              <Button
                styles={`btn flex text-white px-2`}
                onClick={() => setLike(post._id, post.isLiked)}
              >
                {post.isLiked ? "Liked" : "Like"}{" "}
                <FaHeart className={`like m-1 ml-1`} />
              </Button>

              <Button styles={"flex text-white px-2"}>
                Share
                <FaShare className=" m-1 ml-1" />
              </Button>

              <Button styles={"flex text-white px-1"}>
                Delete
                <FaTrash className="m-1 ml-1" />
              </Button>
            </div>

            <div id="comment" className=""></div>
          </Card>
        ))
      )}
    </section>
  );
};

export default page;
