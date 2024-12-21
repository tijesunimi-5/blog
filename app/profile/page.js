"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaComment,
  FaHeart,
  FaPen,
  FaRecycle,
  FaRocket,
  FaShare,
  FaThumbtack,
  FaTools,
  FaTrash,
} from "react-icons/fa";
import { format } from "date-fns";

const page = () => {
  const router = useRouter();
  const [PostInput, setPostInput] = useState(false);
  const green = "text-green-500";
  const white = "text-white";
  const [color, setColor] = useState(white);
  const [width, setWidth] = useState("text-[15px]");
  const { user, updateUser } = useContext(UserContext);
  const [availableUser, setAvailableUser] = useState(
    <h1 className="font-bold lowercase text-xl ml-[-15px]">@Guest</h1>
  );
  const [bio, setBio] = useState(
    <h2 className="font-semibold">New User || Visitor</h2>
  );
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [postContent, setPostContent] = useState("");
  const [message, setMessage] = useState();
  const [posting, setPosting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [posted, setPosted] = useState(false);
  const [postBtn, setPostBtn] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(""), 3000);
  };
  useEffect(() => {
    if (user) {
      setAvailableUser(
        <h1 className="font-bold text-xl ml-[-15px]">{user.username}</h1>
      );
      setBio(<h2 className="font-semibold">{user.bio}</h2>);
      setFollowers(user.followers);
      setFollowing(user.following);
    }
    // console.log(user.username)
  }, [user]);

  //fot the create post btn
  const createPost = () => {
    setPostInput(true);
  };

  const pinPost = async (postId, currentPinnedStatus) => {
    try {
      const updatedPinned = !currentPinnedStatus;
      const res = await fetch("/api/post-apis/updatePostStatus-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          isPinned: updatedPinned,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, isPinned: updatedPinned } : post
          )
        );
      } else {
        console.error("Failed to pin post:", data.message);
      }
    } catch (error) {
      console.error("Error pinning post:", error);
    }
  };

  const setLike = async (postId, currentLikedStatus) => {
    try {
      const updatedLiked = !currentLikedStatus;
      const res = await fetch("/api/post-apis/updatePostStatus-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          isLiked: updatedLiked,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, isLiked: updatedLiked } : post
          )
        );
      } else {
        console.error("Failed:", data.message);
      }
    } catch (error) {
      console.error("Failed:", error);
    }
  };


  //to push the post to database
  const post = async () => {
    if (!postContent) {
      setPostBtn("Post");
      handleMessage("Can't publish an empty post...");
      return;
    }

    if (posting) return;
    setPosting(true);

    try {
      const res = await fetch("api/post-apis/createpost-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          post: postContent,
          name: user.username,
          bio: user.bio,
          isLiked: isLiked,
          isPinned: isPinned,
        }),
      });

      const result = await res.json();

      if (result.success) {
        if (posted) return;
        setPosted(true);
        setPostInput(false);
        handleMessage("Your post has been published...");
        window.location.reload();
      } else {
        handleMessage("Failed to post....");
      }
    } catch (error) {
      handleMessage("An error occured while trying to post...");
    }

    setPosting(false);
    setPosted(false);
  };

  //to fetch post
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

  //this toggles between the post button when creating post
  useEffect(() => {
    if (posting) {
      setPostBtn("Posting...");
    } else if (posted) {
      setPostBtn("Posted!");
    } else {
      setPostBtn("Post");
    }
  }, [posting, posted]);

  return (
    <section className="mb-10">
      <div className="flex">
        <img src="/default_picture.jpg" className="w-[150px] ml-[-10px]" />
        <div className="mt-10">
          <div className="uppercase">{availableUser}</div>
          <div>{bio}</div>
          <div className="flex justify-between pr-7">
            <span>followers: {followers}</span>
            <span>Following: {following}</span>
          </div>
          <div className="flex justify-between ml-[-20px]">
            <Button
              styles={"w-[100px] flex justify-between px-5 py-1"}
              onClick={() => router.push("/edit")}
            >
              Edit <FaTools className="mt-1" />
            </Button>
            <Button
              styles={"flex justify-between px-3 py-1"}
              onClick={createPost}
            >
              Create a post <FaPen className="mt-1 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div id="postDiv" className="mt-4">
        <div id="createPost"></div>
        {PostInput && (
          <div>
            <textarea
              className="post border-2 border-black rounded-md w-[335px] h-[150px] mx-5 px-1"
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <Button styles={"py-1 px-5 font-semibold flex ml-5"} onClick={post}>
              {postBtn}
              <FaRocket className="mt-1 ml-2" />
            </Button>
          </div>
        )}

        <p className="text-center">{message}</p>
      </div>

      <div id="posted" className="px-2">
        {/* still going to map posts */}
        <h1 className="text-2xl font-bold mb-5">Posts -</h1>

        {posts.length === 0 ? (
          <p className="text-center text-3xl font-bold">No posts yet.....</p>
        ) : (
          posts.map((post, index) => (
            <Card key={index} styles={"mt-2"}>
              <div id="userProfile" className="mb-4 flex relative">
                <div className="mt-3">
                  <img
                    src="/default_picture.jpg"
                    className="w-[50px] rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold ml-1 mt-3">{post.name}</h1>
                  <p className="ml-1">{post.bio}</p>
                </div>
                <div>
                  <Button
                    styles={`flex px-2 ${white} absolute right-12`}
                    onClick={() => pinPost(post.postId, post.isPinned)}
                  >
                    {post.isPinned ? "Pinned" : "Pin"}
                    <FaThumbtack className="text-white m-1 ml-1" />
                  </Button>

                  <Button styles={"flex text-white absolute px-2 right-0"}>
                    <FaTrash className="text-white m-1 ml-1" />
                  </Button>
                </div>
              </div>
              <p>{post.post}</p>
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
      </div>
    </section>
  );
};

export default page;
