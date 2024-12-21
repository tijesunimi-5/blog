"use client";
import React, { useState } from "react";
import Button from "./Button";

const Game = () => {
  // const guessBtn = document.querySelector(".guess-btn");
  const guessInput = document.getElementById("guess-input");
  const game = document.getElementById("game");
  const message = document.querySelector(".message");

  let min = 1,
    max = 10;

  const getRandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  let winningNum = getRandomNum(min, max),
    guessesLeft = 3;

  //Event listener to play again
  
game.addEventListener("mousedown", function (e) {
  if (e.target.className === "play-again") {
    window.location.reload();
  }
});

  // const game = (e) => {
  //   if (e.target.className === "play-again") {
  //     window.location.reload();
  //   }
  // }

  const setMessage = (msg, color) => {
    message.style.color = color;
    message.textContent = msg;
  };

  //Game Over finction
  const gameOver = (won, msg) => {
    let color;
    won === true ? (color = "green") : (color = "red");

    guessInput.disabled = true;

    guessInput.style.borderColor = color;

    setMessage(msg);

    guessBtn.value = "Play Again";
    guessBtn.className += "play-again";
  };

  //Listen for guesses
  const guessBtn = () => {
    let guess = parseInt(guessInput.value);

    //Validate input
    if (isNaN(guess) || guess < min || guess > max) {
      setMessage(`Please enter a number between ${min} and ${max}`, "red");
    }

    //Check if guess is correct
    if (guess == winningNum) {
      gameOver(true, `${winningNum} is correct, YOU WIN`);
    } else {
      guessesLeft -= 1;

      if (guessesLeft === 0) {
        gameOver(
          false,
          `Game Over! you lost. The correct number was ${winningNum}`
        );
      } else {
        guessInput.style.borderColor = "red";

        guessInput.value = "";

        setMessage(
          `${guess} is not correct, ${guessesLeft} guesses left`,
          "red"
        );
      }
    }
  }
  

  return (
    <div className="mt-5" id="game" onClick={game}>
      <h1 className="font-bold text-2xl text-center">Number guess - Game</h1>
      <p className="text-center font-semibold">Guess a number between 1 - 10</p>

      <input
        type="number"
        className="num border-2 border-black ml-14 rounded-lg mt-2 mr-2 px-1"
        id="guess-input"
      />
      <input
        type="submit"
        className="guess-btn px-4 text-black rounded-lg border-black border-2"
        value={"Submit"}
        onClick={guessBtn}
      />

      <p className="message text-center pt-2"></p>
    </div>
  );
};

export default Game;
