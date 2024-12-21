"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaHeart,
  FaPen,
  FaRecycle,
  FaRocket,
  FaShare,
  FaThumbtack,
  FaTools,
  FaTrash,
} from "react-icons/fa";

const page = () => {
  const router = useRouter();
  const [PostInput, setPostInput] = useState(false);
  const [pin, setPin] = useState("Pin");
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

  const createPost = () => {
    setPostInput(true);
  };

  const pinPost = () => {
    setPin("Pinned");

    if (pin === "Pinned") {
      setPin("Pin");
    }

    //You're going to set pinned for each post ids ==>
  };

  const setLike = () => {
    const like = document.querySelector(".like");
    if (color === white) {
      setColor(green);
      setWidth("text-[18px]");
    } else {
      setColor(white);
      setWidth("text-[15px]");
    }
  };

  const post = async () => {
    if (posting) return
    setPosting(true)

    if(!postContent) {
      handleMessage('Can\'t publish an empty post...' );
      return
    }
    try {
      const res = await fetch("api/post-apis/createpost-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          post: postContent,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setPostInput(false);
        handleMessage('Your post has been published...')
      } else {
        handleMessage('Failed to post....')
      }
    } catch (error) {
      handleMessage('An error occured while trying to post...')
    }

    setPosting(false)
  };

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
              {posting ? 'Posting...' : 'Post'} <FaRocket className="mt-1 ml-2" />
            </Button>
          </div>
        )}

        <p className="text-center">{message}</p>
      </div>

      <div id="posted" className="px-2">
        {/* still going to map posts */}
        <h1 className="text-2xl font-bold mb-5">Posts -</h1>

        <Card>
          <div id="userProfile" className="mb-4 flex relative">
            <img src="/default_picture.jpg" className="w-[50px] rounded-full" />
            <h1 className="text-xl font-bold ml-1 mt-3">Name</h1>
            <Button
              styles={`flex px-2 ${white} absolute right-0`}
              onClick={pinPost}
            >
              {pin} <FaThumbtack className="text-white m-1 ml-1" />
            </Button>
          </div>
          <p>
            I want to set up frontend developer gig. write a very convincing
            fiverr gig descriptions with not more than 1000 words and 3
            paragraph. First paragraph for greetings and service, second
            paragraph should be explaining why business owners needs to and what
            will happen when they dont get these setups and last paragraph
            should be for round up and CTA ///- Profile ------ Need a frontend
            developer to help you create a stunning website? I can help you our!
            I am well learned in frontend development
          </p>
          <div className="bg-white flex justify-between overflow-hidden rounded w-[355px] py-2 px-1 ml-[-10px] mt-3">
            <Button styles={`btn flex ${color} px-2`} onClick={setLike}>
              Like
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

            <Button styles={"flex text-white px-2"}>
              <FaTrash className="text-white m-1 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default page;
