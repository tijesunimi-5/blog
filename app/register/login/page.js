"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { UserContext } from "@/context/userContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await fetch("/api/register-apis/login-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.blogger);
        console.log(data.blogger);
        handleError("Login successful");
        router.push("/");
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError("An error occured during login");
    }

    setLoading(false);
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button styles={"mt-5 px-8 py-1"} onClick={handleLogin}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-5 font-[600]">
          You don't have an account?{" "}
          <Link href={"/register/signup"} className="underline">
            Sign up here!
          </Link>
        </div>

        {error && <p className="mt-3 text-center text-blue-600">{error}</p>}
      </Card>
    </section>
  );
};

export default page;
