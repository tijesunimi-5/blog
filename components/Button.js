"use client";
import React from "react";

const Button = ({ children, styles, onClick }) => {
  return (
    <button onClick={onClick} className={`bg-blue-300 font-semibold border-2 border-white rounded-md shadow-lg ${styles}`}>
      {children}
    </button>
  );
};

export default Button;
