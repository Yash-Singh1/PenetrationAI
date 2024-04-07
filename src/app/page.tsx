"use client";

import { memo, useMemo, useState } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import Terminal from "@/components/terminal";
import Editor from "@/components/editor";
import { Input } from "@/components/ui/input";
import { Bot, SendHorizonal, User } from "lucide-react";
import rehypeShiki from "@shikijs/rehype";
import dynamic from "next/dynamic";
import { Checkbox } from "@/components/ui/checkbox";
import { visit } from "unist-util-visit";

const Markdown = dynamic(() => import("react-markdown"), { ssr: false });

const MarkdownMemoizationWrapper = memo(
  Markdown,
  function areEqual(prevProps, nextProps) {
    return prevProps.children === nextProps.children;
  }
);

export default function Home() {
  const [msgs, setMsgs] = useState<
    { user: boolean; text: string; inProgress?: boolean }[]
  >([]);
  const [currMsg, setCurrMsg] = useState<string>("");
  const [tools, setTools] = useState("0");

  function handleClick() {
    if (tools == "0") {
      setTools("1");
    }
    if (tools == "1") {
      setTools("0");
    }
  }

  return (
    <>
      <main className="grid font-mono min-h-screen max-h-screen grid-cols-2 gap-x-4 items-start justify-between p-8 overflow-y-hidden">
        <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full">
          <div className="flex font-mono text-sm flex-col relative w-full bg-slate-800 rounded-md self-baseline overflow-scroll flex-grow gap-y-2 p-4 h-96">
            {msgs.length ? (
              msgs.map((msg, i) => {
                return (
                  <div key={i} className="flex flex-row">
                    <div className="bg-slate-800 p-1 inline-block">
                      {msg.user ? (
                        <User className="border-2 border-white rounded-full" />
                      ) : (
                        <Bot className="border-2 border-white rounded-full" />
                      )}
                    </div>
                    <hr className="divide-x-4 > * + * h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 z-10" />
                    <div className="flex flex-col w-[-webkit-fill-available]">
                      <h4 className="font-bold">{msg.user ? "You" : "Bot"}</h4>
                      {msg.inProgress ? (
                        <div className="flex flex-row gap-x-1 py-2">
                          <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                          <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                          <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {msg.user ? (
                            <p>{msg.text}</p>
                          ) : (
                            <MarkdownMemoizationWrapper
                              rehypePlugins={
                                msg.text.includes("```")
                                  ? [
                                      [
                                        rehypeShiki,
                                        {
                                          themes: {
                                            dark: "vitesse-dark",
                                            light: "vitesse-light",
                                          },
                                        },
                                      ],
                                      [
                                        function findPre(tree) {
                                          visit(tree, "element", (node) => {
                                            if (node.tagName === "pre") {
                                              console.log(node.textContent)
                                            }
                                          });
                                        },
                                      ],
                                    ]
                                  : []
                              }
                            >
                              {msg.text}
                            </MarkdownMemoizationWrapper>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <h1 className="text-2xl text-center font-bold">
                  Welcome to PenetrateAI
                </h1>
                <p className="px-8 py-4 text-base text-start">
                  I&apos;m here to help you with your penetration testing needs.
                  Whether it&apos;s reconnaissance, vulnerability scanning, or
                  exploitation, I&apos;m here to assist you.
                </p>
              </div>
            )}
          </div>
          <div className="bottom-0 border-2 border-t-0 border-muted-foreground flex flex-row justify-center w-full">
            <Input
              className="flex-shrink focus-visible:outline-none focus-visible:![box-shadow:none] rounded-t-none flex-grow-0 flex rounded-r-none border-none"
              placeholder="Enter your requests"
              disabled={
                msgs.length > 0 ? msgs[msgs.length - 1].inProgress : false
              }
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setMsgs((msgs) => [
                    ...msgs,
                    { user: true, text: (e.target as HTMLInputElement).value },
                    { user: false, text: "", inProgress: true },
                  ]);
                  fetch("https://4c38-107-77-212-233.ngrok-free.app/chat", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    // mode: 'no-cors',
                    body: JSON.stringify(
                      {
                        iftool: tools,
                        message: (e.target as HTMLInputElement).value,
                      },
                      null,
                      2
                    ),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setMsgs((msgs_) => [
                        ...msgs_.slice(0, -1),
                        {
                          user: false,
                          text: data,
                        },
                      ]);
                    });
                  setCurrMsg("");
                }
              }}
              onChange={(e) => setCurrMsg(e.target.value)}
              value={currMsg}
            />
            <div className="bg-background rounded-t-none rounded-r-md p-2 flex justify-center items-center">
              <SendHorizonal className="h-4 w-4 cursor-pointer flex-grow flex-shrink-0" />
            </div>
          </div>
          <div className="flex gap-x-2 items-center mt-2">
            <Checkbox onClick={handleClick} id="terms" />
            <label
              htmlFor="terms"
              className="static text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Use tools
            </label>
          </div>
        </div>
        <Tabs defaultValue="terminal" className="min-h-screen">
          <TabsList className="gap-x-4 px-4 rounded-b-none w-full justify-start">
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          <TabsContent value="terminal">
            <Terminal />
          </TabsContent>
          <TabsContent value="editor">
            <Editor />
          </TabsContent>
          <TabsContent value="data"></TabsContent>
        </Tabs>
      </main>
    </>
  );
}
