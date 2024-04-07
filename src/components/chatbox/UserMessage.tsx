"use client";

import React from "react";

export default function UserMessage({ text }) {
  console.log(text);
  return (
    <div className="message-container">
      <div className="user-message">{text}</div>
    </div>
  );
}
