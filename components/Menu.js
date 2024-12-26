"use client";
import React, { useContext, useEffect, useState } from "react";
import Button from "./Button";
import Link from "next/link";
import { UserContext } from "@/context/userContext";
import { set } from "date-fns";
import { useRouter } from "next/navigation";

const Menu = ({toogleMenuOff}) => {
  const { user, logout } = useContext(UserContext);
  const [btnContent, setBtnContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("User state:", user); // Check the value of `user`
    if (user) {
      setBtnContent("Log out");
    } else {
      setBtnContent("Login");
    }
  }, [user]);

  const btn = () => {
    if (btnContent === "Login") {
      const menu = document.querySelector(".menu");
      const bars = document.querySelector(".bars");
      const minus = document.querySelector(".minus");
      router.push("/register/login");
      menu.style.display = "none";
      minus.style.display = "none";
      bars.style.display = "block";
      return;
    }

    if (btnContent === 'Log out') {
      const menu = document.querySelector(".menu");
      const bars = document.querySelector(".bars");
      const minus = document.querySelector(".minus");
      logout();
      router.push("/register/login");
      menu.style.display = "none";
      minus.style.display = "none";
      bars.style.display = "block";
    }
  };

  return (
    <nav className="menu hidden absolute  flex-col right-0 left-0 top-10 bg-gray-500 z-50 text-center text-white">
      <Button styles={"mt-2 w-[300px]"} onClick={toogleMenuOff}>
        <Link href={"/profile"} className=" text-xl w-full">
          Profile
        </Link>
      </Button>

      <Button
        styles={"bg-white text-blue-300 mt-3 w-[300px] border-blue-300"}
        onClick={toogleMenuOff}
      >
        <Link href={"/"} className=" text-xl w-full">
          View posts
        </Link>
      </Button>

      <Button
        styles={"bg-white text-blue-300 mt-3 w-[300px] border-blue-300"}
        onClick={toogleMenuOff}
      >
        <Link href={"/users"} className=" text-xl w-full">
          See Users
        </Link>
      </Button>

      <Button styles={"mt-3 w-[300px]"} onClick={toogleMenuOff}>
        <Link href={"/settings"} className=" text-xl w-[300px]">
          Settings
        </Link>
      </Button>

      <div>
        <Button styles={"mt-4 w-[200px] mb-5"} onClick={btn}>
          {btnContent}
        </Button>
      </div>
    </nav>
  );
};

export default Menu;
