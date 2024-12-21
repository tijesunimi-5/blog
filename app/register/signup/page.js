"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEnvelope, FaKey, FaSnowman } from "react-icons/fa";

const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const bio = "New User || Reader";
  const post = "No post yet!";
  const isFollowing = false;
  const followers = 0;
  const following = 0;
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const handleError = (message) => {
      setError(message);
      setTimeout(() => setError(""), 3000);
    };

    


    if (!email || !name || !password) {
      handleError('All fields are required')
      return;
    }
    
    try {
      const response = await fetch("/api/register-apis/signup-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
          bio: bio,
          post: post,
          isFollowing: isFollowing,
          followers: followers,
          following: following,
        }),
      });
      const result = await response.json();
      if (result.success) {
        handleError('Sign up successful')
        router.push("/register/login");
      } else {
        handleError("Failed to register");
      }
    } catch (error) {
      handleError("An error occured during sign up");
    }
  };

  return (
    <section>
      <h1 className="flex justify-center pt-20 text-3xl font-bold">
        Login to your account!
      </h1>
      <Card styles={"w-[350px] ml-3 mt-[20px]"}>
        <form>
          <div>
            <label htmlFor="email" className="font-semibold flex text-xl">
              <FaEnvelope className="mt-1 mx-1" /> Email:
            </label>
            <input
              type="email"
              required
              id="email"
              className="w-[325px] shadow-sm rounded-md px-1"
              onChange={(e) => { console.log(e.target.value)
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="mt-2">
            <label htmlFor="name" className="font-semibold flex text-xl">
              <FaSnowman className="mt-1 mx-1" /> Name:
            </label>
            <input
              type="name"
              required
              id="name"
              className="w-[325px] shadow-sm rounded-md px-1"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div className="mt-2">
            <label htmlFor="password" className="font-semibold flex text-xl">
              <FaKey className="mt-1 mx-1" /> Password:
            </label>
            <input
              type="password"
              required
              id="password"
              className="w-[325px] shadow-sm rounded-md px-1"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <Button styles={"mt-5 px-8 py-1"} onClick={handleSignIn}>Sign up</Button>
        </form>
        <div className="mt-5 font-[600]">
          Have an account already?{" "}
          <Link href={"/register/login"} className="underline">
            Login here!
          </Link>
        </div>

        {error && <p className="mt-3 text-center text-blue-600">{error}</p>}
      </Card>
    </section>
  );
};

export default page;
