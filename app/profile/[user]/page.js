"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";

export default function UserProfile() {
  const userId = usePathname();
  const mainId = userId.split("/").pop(); // Extract User ID
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    try {
      // Load users from localStorage
      const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
      setUsers(savedUsers);

      // Find the user profile based on ID
      const profile = savedUsers.find((user) => user.id === parseInt(mainId));
      if (profile) {
        setUserProfile(profile);
        setIsFollowing(profile.isFollowing || false);
        setFollowers(profile.followers || 0);
      }
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
    }

  }, [mainId]);

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


  if (!userProfile) {
    return <div>User not found.</div>;
  }

  return (
    <section className="profile">
      <div className="profile-header">
        <div className="rounded-full bg-red-300 w-[100px] h-[100px] border-2 border-white overflow-hidden">
          <img
            src={userProfile.profile_picture || "/default-profile.png"}
            alt={userProfile.name || "Profile"}
          />
        </div>
        <h1 className="text-2xl font-bold">
          {userProfile.name || "Unknown User"}
        </h1>
        <p>{userProfile.bio || "No bio available."}</p>
        <p>Followers: {followers}</p>
      </div>
      <Button styles={"w-[110px] mt-5"} onClick={toggleFollow}>
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <div className="profile-posts">
        <h2 className="text-xl font-semibold">Best Post:</h2>
        <p className="post">
          {typeof userProfile.post === "object"
            ? JSON.stringify(userProfile.post, null, 2)
            : userProfile.post || "No post available."}
        </p>
      </div>
    </section>
  );
}
