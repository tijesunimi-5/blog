"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";

export default function UserProfile() {
  const userId = usePathname();
  const mainId = userId.split("/").pop(); // Extract User ID
  const [users, setUsers] = useState();
  const [userProfile, setUserProfile] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  
  // console.log("registered users:", JSON.parse(registeredUser));
  
  useEffect(() => {
    const registeredUser = localStorage.getItem('users')
    const parsedRegUsers = JSON.parse(registeredUser);

    const clickedUser = parsedRegUsers.filter((user) => user._id === mainId);

    setUsers(clickedUser);
    // setUserProfile(clickedUser)
    console.log('this is user profile hook',userProfile)
    console.log('working', clickedUser)
  }, [mainId])


 const toggleFollow = () => {
   const updatedUsers = users.map((user) => {
     if (user.id === parseInt(mainId)) {
       // Modify the user's data directly
       user.isFollowing = !isFollowing;
       user.followers = isFollowing ? followers - 1 : followers + 1;
     }
     return user; // Return the user object
   });

   // Update state and localStorage
   setUsers(updatedUsers);
   localStorage.setItem("users", JSON.stringify(updatedUsers));
   setIsFollowing(!isFollowing);
   setFollowers(isFollowing ? followers - 1 : followers + 1);
 };


  if (!users) {
    return <div>User not found.</div>;
  }

  return (
    <section className="profile">
      <div className="profile-header">
        <div className="rounded-full bg-red-300 w-[100px] h-[100px] border-2 border-white overflow-hidden">
          <img
            src={users.profile_picture || "/default_picture.jpg"}
            alt={users.username || "Profile"}
          />
        </div>
        <h1 className="text-2xl font-bold">
          {users.username || "Unknown User"}
        </h1>
        <p>{users.bio || "No bio available."}</p>
        <p>Followers: {followers}</p>
      </div>
      <Button styles={"w-[110px] mt-5"} onClick={toggleFollow}>
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <div className="profile-posts">
        <h2 className="text-xl font-semibold">Best Post:</h2>
        <p className="post">
          {users.post}
        </p>
      </div>
    </section>
  );
}
