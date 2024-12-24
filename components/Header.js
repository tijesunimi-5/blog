"use client";
import Link from "next/link";
import React from "react";
import { FaBars, FaMinus } from "react-icons/fa";
import Menu from "./Menu";

const Header = () => {
  const toggleMenuOn = () => {
    const bars = document.querySelector(".bars");
    const minus = document.querySelector(".minus");
    const menu = document.querySelector(".menu");

    bars.style.display = "none";
    minus.style.display = "block";
    menu.style.display = "block";
  };

  const toggleMenuOff = () => {
    const bars = document.querySelector(".bars");
    const minus = document.querySelector(".minus");
    const menu = document.querySelector(".menu");

    bars.style.display = "block";
    minus.style.display = "none";
    menu.style.display = "none";
  };

  return (
    <header className="bg-black text-white flex justify-between align-middle sticky top-0 z-50">
      <Link href={"/"} onClick={toggleMenuOff} className="text-3xl font-bold font-serif pl-3 pt-1">
        BLOG...
      </Link>

      <nav>
        <span className="flex">
          <FaBars onClick={toggleMenuOn} className="bars text-2xl m-2" />
          <FaMinus
            onClick={toggleMenuOff}
            className="minus text-2xl m-2 hidden"
          />
        </span>
      </nav>
      <Menu toogleMenuOff={toggleMenuOff} />
    </header>
  );
};

export default Header;
