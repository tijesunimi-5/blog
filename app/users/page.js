"use client";
"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Game from "@/components/Game";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { UserContext } from "@/context/userContext";

export default function Home() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const white = "text-white";
  const { user } = useContext(UserContext);

  // Toggle following state for a specific user
  const setFollowing = (userId) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              isFollowing: !user.isFollowing,
              followers: user.isFollowing
                ? user.followers - 1
                : user.followers + 1,
            }
          : user
      );

      // Save updated users to localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      return updatedUsers;
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/getUser-api");
        const data = await res.json();

        if (data.success) {
          const allUsers = data.users.map((user) => ({
            ...user,
            id: user._id,
          }));
          setUsers(allUsers);
          localStorage.setItem("users", JSON.stringify(allUsers));
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="mb-10">
      {/* <Game /> */}

      {users.length === 0 ? (
        <p className="text-center text-3xl font-bold">No Users yet.....</p>
      ) : (
        users.map((user, index) => (
          <Card key={index} styles={"w-[360px] mx-2 mt-3"}>
            <div className="relative flex">
              <div className="rounded-full bg-red-300 w-[100px] h-[100px] border-2 border-white overflow-hidden">
                <img
                  src={user.profile_picture}
                  alt={`${user.username}'s profile`}
                />
              </div>

              <div className="flex flex-col mt-2 w-[220px]">
                <span className="text-[1em] font-extrabold">
                  {user.username}
                </span>
                <p className="pl-1 font-semibold w-[220px] break-words overflow-hidden">
                  {user.bio}
                </p>

                <div className="flex w-[300px] ml-0">
                  <Button
                    styles={"w-[110px] mt-5"}
                    onClick={() => setFollowing(user.id)}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </Button>

                  <Button
                    styles={"w-[110px] mt-5 ml-2"}
                    onClick={() => router.push(`/profile/${user.id}`)}
                  >
                    See profile
                  </Button>
                </div>
              </div>
            </div>

            <hr className="mt-5 h-4" />

            {/* {userPost ? (
              <div>
                <span className="font-semibold font-sans text-xl">Post:</span>
                <p className="post-text font-mono relative w-[310px] h-[70px] overflow-hidden text-pretty">
                  {userPost.post}
                </p>
                <Button
                  styles={"read-more cursor-pointer px-2 ml-[200px] my-2"}
                >
                  Read more...
                </Button>
              </div>
            ) : (
              <p className="font-mono">No Post Available</p>
            )} */}
          </Card>
        ))
      )}
    </section>
  );
}
