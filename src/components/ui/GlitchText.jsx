import React from "react";
import "./glitch.css";

export default function GlitchText({ text }) {
  return (
    <h1 className="glitch" data-text={text}>
      {text}
    </h1>
  );
}