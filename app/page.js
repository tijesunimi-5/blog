"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Game from "@/components/Game";
import { getAllUser } from "@/dummy/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  FaComment,
  FaHeart,
  FaPen,
  FaShare,
  FaThumbtack,
  FaTrash,
} from "react-icons/fa";

export default function Home() {
  const initialUsers = getAllUser();
  const [users, setUsers] = useState(initialUsers); // Properly set initial state
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const white = "text-white";
  const [posts, setPosts] = useState([]);
  const [color, setColor] = useState(white);
  const [width, setWidth] = useState("text-[15px]");

  //to load users from localstorage on component mount
  // useEffect(() => {
  //   const savedUsers = localStorage.getItem("users");
  //   if (savedUsers) {
  //     setUsers(JSON.parse(savedUsers));
  //   }
  // }, []);

  //Save users to localstorage whenever users state changes
  // useEffect(() => {
  //   localStorage.setItem("users", JSON.stringify(users));
  // }, [users]);

  // Toggle following state for a specific user
  const setFollowing = (userId) => {
    setFollowers(userId.followers || 0);
    setIsFollowing(userId.isFollowing || false);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              isFollowing: !user.isFollowing,
              followers: isFollowing ? followers - 1 : followers + 1,
            }
          : user
      )
    );
  };

  useEffect(() => {
    const formatCreatedAt = (dateString) => {
      const date = new Date(dateString);
      return format(date, "do 'of' MMM, yyyy");
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post-apis/getposts-api");
        const data = await res.json();

        if (data.success) {
          // Format the `createdAt` field for each post
          const formattedPosts = data.posts.map((post) => ({
            ...post,
            createdAt: formatCreatedAt(post.createdAt),
            postId: post._id,
          }));

          setPosts(formattedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section>
      {/* <Game /> */}
      <div className="mt-10 relative">
        {users.map((user) => (
          <Card styles={"w-[360px] mx-2 mt-3"} key={user.id}>
            <div>
              <p className="post-text font-mono relative w-[310px] h-[70px] overflow-hidden text-pretty">
                {user.post}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-3xl font-bold">No posts yet.....</p>
      ) : (
        posts.map((post, index) => (
          <Card key={index} styles={"mt-2"}>
            <div className="relative flex">
              <div className="rounded-full bg-red-300 w-[100px] h-[100px] border-2 border-white overflow-hidden">
                <img
                  src={post.profile_picture}
                  alt={`${post.name}'s profile`}
                />
              </div>

              <div className="flex flex-col mt-2 w-[220px]">
                <span className="text-[1em] font-extrabold">{post.name}</span>
                <p className="pl-1 font-semibold w-[220px] break-words overflow-hidden">
                  {post.bio}
                </p>
                <div className="flex w-[300px] ml-[0px]">
                  <Button
                    styles={"w-[110px] mt-5"}
                    onClick={() => setFollowing(post.id)}
                  >
                    {post.isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    styles={"w-[110px] mt-5 ml-2"}
                    onClick={() => {
                      router.push(`/profile/${post.id}`);
                    }}
                  >
                    See profile
                  </Button>
                </div>
              </div>
            </div>

            <hr className="mt-5 h-4 " />

            <div>
              <span className="font-semibold font-sans text-xl">
                Best post:
              </span>
              <p className="post-text font-mono relative w-[310px] h-[70px] overflow-hidden text-pretty">
                {post.post}
              </p>
              <Button styles={"read-more cursor-pointer px-2 ml-[200px] my-2"}>
                See more...
              </Button>
            </div>
            <div className="bg-white flex justify-between overflow-hidden rounded w-[355px] py-2 px-1 ml-[-10px] mt-3">
              <Button
                styles={`btn flex ${color} px-2`}
                onClick={() => setLike(post.postId, post.isLiked)}
              >
                {post.isLiked ? "Liked" : "Like"}
                <FaHeart className={`like ${width} m-1 ml-1`} />
              </Button>

              <Button styles={"flex text-white px-2"}>
                Share
                <FaShare className="text-white m-1 ml-1" />
              </Button>
              <Button styles={"flex text-white px-2"}>
                Edit
                <FaPen className="text-white m-1 ml-1" />
              </Button>

              <Button styles={"flex text-white px-1"}>
                Comment <FaComment className="text-white m-1 ml-1" />
              </Button>
            </div>
            <p className="pt-4 underline">created at: {post.createdAt}</p>
          </Card>
        ))
      )}
    </section>
  );
}
