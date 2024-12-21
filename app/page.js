"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Game from "@/components/Game";
import { getAllUser } from "@/dummy/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const initialUsers = getAllUser();
  const [users, setUsers] = useState(initialUsers); // Properly set initial state
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

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

  return (
    <section>
      {/* <Game /> */}
      <div className="mt-10">
        {users.map((user) => (
          <Card styles={"w-[360px] mx-2 mt-3"} key={user.id}>
            <div className="relative flex">
              <div className="rounded-full bg-red-300 w-[100px] h-[100px] border-2 border-white overflow-hidden">
                <img
                  src={user.profile_picture}
                  alt={`${user.name}'s profile`}
                />
              </div>

              <div className="flex flex-col mt-2 w-[220px]">
                <span className="text-[1em] font-extrabold">{user.name}</span>
                <p className="pl-1 font-semibold w-[220px] break-words overflow-hidden">
                  {user.bio}
                </p>
                <div className="flex w-[300px] ml-[0px]">
                  <Button
                    styles={"w-[110px] mt-5"}
                    onClick={() => setFollowing(user.id)}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    styles={"w-[110px] mt-5 ml-2"}
                    onClick={() => {
                      router.push(`/profile/${user.id}`);
                      
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
                {user.post}
              </p>
            </div>
            <Button styles={"read-more cursor-pointer px-2 ml-[200px] my-2"}>
              See more...
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
