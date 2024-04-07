"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import XTerm from "./xterm";
import { useRef, useEffect } from "react";

export default function Terminal() {
  const xtermRef = useRef(null);
  // const [letter, setLetter] = useState("a");
  // const [isTyping, setIsTyping] = useState(false);

  // useEffect(() => {
  //   // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
  //   if (xtermRef.current) {
  //     console.log(letter);
  //     xtermRef.current.terminal.writeln("> \n");
  //     //xtermRef.current.terminal.writeln(letter);
  //   }
  // }, [xtermRef.current, isTyping])
  return (
    // Create a new terminal and set it's ref.
    <div>
      <XTerm
      // ref={xtermRef}
      // onKey={(event) => xtermRef.current?.terminal.write(event.key)}
      // options={{ lineHeight: 1, cursorStyle: "underline" }}
      />
    </div>
  );
}
