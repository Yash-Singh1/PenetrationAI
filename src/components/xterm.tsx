"use client";

import { Terminal } from "@xterm/xterm";
import {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import "@xterm/xterm/css/xterm.css";

let cwd = "/usr/src/app";
const ws2q = new Set<string>();
const ws = new WebSocket("ws://localhost:3003");
const ws2 = new WebSocket("ws://localhost:6767/ws")

let XTerm = forwardRef<Terminal>((_props, ref) => {
  const [idle, setIdle] = useState(false);
  const termExposed = useMemo(
    () =>
      new Terminal({
        cursorBlink: true,
        theme: {
          background: "#000",
        },
      }),
    []
  );
  const [currLine, setCurrLine] = useState("");

  const prompt = useCallback(() => {
    termExposed.write("╭─ " + cwd + "\r\n" + "╰─ ");
  }, [termExposed]);

  ws2.onmessage = (e) => {
    const data = JSON.parse(e.data);
    termExposed.writeln(data.command);
    setIdle(true);
    const id = data.id;
    ws2q.add(id);
    ws.send(
      JSON.stringify({
        type: "run",
        command: data.command,
        id,
        pwd: cwd,
      })
    );
  };

  const enter = useCallback(() => {
    console.log(currLine, "entered");
    let dupped = false;
    setCurrLine((cLine) => {
      if (dupped) return "";
      dupped = true;
      ws.send(
        JSON.stringify({
          type: "run",
          command: cLine,
          id: Math.random().toString(8),
          pwd: cwd,
        })
      );
      return "";
    });
    setIdle(true);
    termExposed.writeln("");
  }, [currLine, setIdle, ws, cwd]);

  useEffect(() => {
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (ws2q.has(data.id)) {
        ws2q.delete(data.id);
        setIdle(false);
        console.log(data.result);
        data.result.split("\n").forEach((line: string) => {
          termExposed.writeln(line);
        });
        ws2.send(
          JSON.stringify({ type: "run", output: data.output, id: data.id })
        );
        prompt();
        return;
      }
      if (data.type === "result") {
        data.result.split("\n").forEach((line: string) => {
          termExposed.writeln(line);
        });
        cwd = data.pwd;
        setIdle(false);
        prompt();
      }
    };
  });
  const divRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => {
    return termExposed;
  });

  useEffect(() => {
    if (divRef.current && !termExposed.element) {
      termExposed.open(divRef.current);
      termExposed.focus();
      prompt();
      termExposed.onKey((e) => {
        if (idle) {
          return;
        }
        if (e.domEvent.key === "Enter") {
          enter();
        } else if (e.domEvent.key === "Backspace") {
          setCurrLine(currLine.slice(0, -1));
          termExposed.write("\b \b");
        } else {
          setCurrLine((cLine) => cLine + e.key);
          termExposed.write(e.key);
        }
      });
    }
  }, [termExposed]);

  return (
    <div
      className="min-h-[calc(100vh-7rem)] overflow-x-scroll bg-black"
      ref={divRef}
    ></div>
  );
});

export default XTerm;
