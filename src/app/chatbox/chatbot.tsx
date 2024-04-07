"use client";
import React, { useState, useEffect } from "react";

import ReactDOM from "react-dom";

import BotMessage from "@/components/chatbox/BotMessage";
import UserMessage from "@/components/chatbox/UserMessage";
import Messages from "@/components/chatbox/Messages";
import Input from "@/components/chatbox/Input";

//import API from "./ChatbotAPI";

import Header from "@/components/chatbox/Header";

export default function Chatbot() {
  const API = {
    GetChatbotResponse: async (message) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (message === "hi") resolve("Welcome to chatbot!");
          else resolve("echo : " + message);
        }, 2000);
      });
    },
  };
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => await API.GetChatbotResponse(text)}
        />,
      ]);
    }
    loadWelcomeMessage();
  }, []);

  const send = async (text) => {
    console.log(text);
    const newMessages = messages.concat(
      <UserMessage key={messages.length + 1} text={text} />,
      <BotMessage
        key={messages.length + 2}
        fetchMessage={async () => await API.GetChatbotResponse(text)}
      />,
    );
    setMessages(newMessages);
  };

  return (
    <div className="chatbot">
      <Header />
      <Messages />
      <Input onSend={send} />
    </div>
  );
}
