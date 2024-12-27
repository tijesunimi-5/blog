"use client";
import Button from "@/components/Button";
import { UserContext } from "@/context/userContext";
import { setLazyProp } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

const page = () => {
  const { user, updateUser } = useContext(UserContext);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showBioInput, setShowBioInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newName, setNewName] = useState(user?.username || "");
  const [newBio, setNewBio] = useState(user?.bio || "");
  const [newPassword, setNewPassword] = useState(user?.password || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter()

  const revealUserInput = () => {
    setShowUsernameInput(true);
  };

  const revealBioInput = () => {
    setShowBioInput(true);
  };

  const revealPasswordInput = () => {
    setShowPasswordInput(true);
  };

  const handleMessage = (msg, duraion = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), duraion);
  };

  const saveChanges = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/settings-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          newName,
          newBio,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        handleMessage("Profile updated successfully");
        updateUser({
          ...user,
          bio: newBio,
          username: newName,
          password: newPassword,
        });

        router.push('/profile')
      } else {
        handleMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      handleMessage("An error occured during update");
    }

    setLoading(false);
  };

  return (
    <section id="settings" className="px-2">
      <h1 className="mt-5 text-center font-bold text-2xl">Settings</h1>
      <p>
        Due to some technical issues, what ever you've posted with your previous
        name won't appear when you change your name. So please, it's advisable
        you use your name and don't change for now. Our technicians are working
        on improvement. Thank you!
      </p>
      <div className="mt-5">
        <h1 className="text-xl font-bold" onClick={revealUserInput}>
          Change Username
        </h1>
        {showUsernameInput && (
          <input
            type="text"
            className="w-[300px] rounded-md shadow-lg border border-black"
            onChange={(e) => setNewName(e.target.value)}
          />
        )}
      </div>

      <div className="my-5" onClick={revealBioInput}>
        <h1 className="text-xl font-bold">Change Bio</h1>
        {showBioInput && (
          <input
            type="text"
            className="w-[300px] rounded-md shadow-lg border border-black"
            onChange={(e) => setNewBio(e.target.value)}
          />
        )}
      </div>

      <div>
        <h1 className="text-xl font-bold" onClick={revealPasswordInput}>
          Change Password
        </h1>
        {showPasswordInput && (
          <input
            type="text"
            className="w-[300px] rounded-md shadow-lg border border-black"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        )}
      </div>

      <Button styles={"mt-5 px-3 text-xl"} onClick={saveChanges}>
        {loading ? "Saving changes..." : "Save changes"}
      </Button>

      <h1 className="text-blue-400 text-xl mt-5 text-center font-semibold">
        {message}
      </h1>
    </section>
  );
};

export default page;
