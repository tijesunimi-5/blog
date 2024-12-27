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
import Link from "next/link";
import { PostContext } from "@/context/postContext";

const page = () => {
  const { addPost, post, setPost, updatePost } = useContext(PostContext);
  const router = useRouter();
  const [PostInput, setPostInput] = useState(false);
  const white = "text-white";
  const [color, setColor] = useState(white);
  const [width, setWidth] = useState("text-[15px]");
  const { user } = useContext(UserContext);
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
  const [posted, setPosted] = useState(false);
  const [postBtn, setPostBtn] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [profile_picture, setProfile_picture] = useState(
    "/default_picture.jpg"
  );
  const [userPosts, setUserPosts] = useState([]);
  const [posts, setPosts] = useState([]); // Assuming your posts are stored here

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

  const pinPost = async (postId, isPinned) => {
    try {
      console.log("Pinning post:", postId, isPinned);

      const response = await fetch("/api/post-apis/updatePostStatus-api", {
        method: "POST",
        body: JSON.stringify({ postId, isPinned }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.success) {
        // Update the state to reflect the new "pinned" status
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, isPinned: !post.isPinned } : post
          )
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error pinning post:", error);
    }
  };

  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post-apis/getposts-api");
        const data = await res.json();

        if (data.success) {
          setPosts(data.posts);

          if (user) {
            const filteredPosts = data.posts.filter(
              (post) => post.name === user.username
            );
            setUserPosts(filteredPosts);
          }
        } else {
          setMessage("No Posts available");
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setMessage("An error occured while fetching posts. try again!");
      }
    };

    fetchPosts();
  }, [user]);

  useEffect(() => {
    if (user) {
      setAvailableUser(
        <h1 className="font-bold text-xl ml-[-15px]">{user.username}</h1>
      );
      setBio(<h2 className="font-semibold">{user.bio}</h2>);
      setFollowers(user.followers);
      setFollowing(user.following);
      setProfile_picture(user.profile_picture);
    }
    // console.log(user.username)
  }, [user]);

  //for the create post btn
  const createPost = () => {
    setPostInput(true);
  };

  //to push the post to database
  const Post = async () => {
    if (!postContent) {
      setPostBtn("Post");
      handleMessage("Can't publish an empty P...");
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
          profile_picture: profile_picture,
        }),
      });

      const result = await res.json();

      if (result.success) {
        if (posted) return;
        setPosted(true);
        setPostInput(false);
        handleMessage("Your post has been published...");
        window.location.reload();
        addPost(result.post);
      } else {
        handleMessage("Failed to post....");
      }
    } catch (error) {
      handleMessage("An error occured while trying to post...");
    }

    setPosting(false);
    setPosted(false);
  };

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

  //delete posts!!
  const deletePost = async (postId) => {
    try {
      const res = await fetch("/api/post-apis/deleteposts-api", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      const data = await res.json();
      console.log("Post deleted successfully:", data);
      handleMessage(data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <section className="mb-10">
      {user ? (
        <>
          <div className="flex justify-between">
            <img
              src={profile_picture || "/default_picture.jpg"}
              className="w-[150px] ml-[-10px]"
            />
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
                  onClick={() => router.push("/settings")}
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
                <Button
                  styles={"py-1 px-5 font-semibold flex ml-5"}
                  onClick={Post}
                >
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
              <p className="text-center text-3xl font-bold">
                No posts yet.....
              </p>
            ) : (
              userPosts.map((post, index) => (
                <Card key={index} styles={"mt-2"}>
                  <div id="userProfile" className="mb-4 flex relative">
                    <div className="mt-3">
                      <img
                        src="/default_picture.jpg"
                        className="w-[50px] rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-xl font-bold ml-1 mt-3">
                        {post.name}
                      </h1>
                      <p className="ml-1">{post.bio}</p>
                    </div>
                    <div>
                      <Button
                        styles={`flex px-2 ${white} absolute right-12`}
                        onClick={() => pinPost(post._id, post.isPinned)}
                      >
                        {post.isPinned ? "Pinned" : "Pin"}
                        <FaThumbtack className="text-white m-1 ml-1" />
                      </Button>

                      <Button
                        styles={"flex text-white absolute px-2 right-0"}
                        onClick={() => deletePost(post._id)}
                      >
                        <FaTrash className="text-white m-1 ml-1" />
                      </Button>
                    </div>
                  </div>
                  <p>{post.post}</p>
                  <div className="bg-white flex justify-between overflow-hidden rounded w-[355px] py-2 px-1 ml-[-10px] mt-3">
                    <Button
                      styles={`btn flex ${color} px-2`}
                      onClick={() => setLike(post._id, post.isLiked)}
                    >
                      {post.isLiked ? "Liked" : "Like"}
                      <FaHeart className={`like ${width} m-1 ml-1`} />
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
        </>
      ) : (
        <>
          <div className="flex">
            <img src="/default_picture.jpg" className="w-[150px] ml-[-10px]" />
            <div className="mt-10">
              <div className="uppercase">{availableUser}</div>
              <div>{bio}</div>
              <div className="flex justify-between pr-7">
                <span>followers: {followers}</span>
                <span className="pl-5">Following: {following}</span>
              </div>
            </div>
          </div>

          <div className="text-center justify-center mt-40 text-xl">
            Please proceed to{" "}
            <Link className="underline font-semibold" href={"/register/login"}>
              login
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default page;
