"use client";

import MonacoEditor from "react-monaco-editor";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import { useState, useEffect } from "react";
// @ts-expect-error -- monaco-editor doesnt type main implementation of langs
import { conf } from "monaco-editor/esm/vs/basic-languages/python/python";

export default function Editor() {
  const [value, setValue] = useState("# placeholder\nprint('hello world')");

  return (
    <>
      <div>
        <MonacoEditor
          language="python"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          className="min-h-[calc(100vh-8rem)] w-full"
          theme="vs-dark"
          options={conf}
        ></MonacoEditor>
        <button
          onClick={() => {
            const el = Array.from(document.querySelectorAll("#chat pre")).pop();
            setValue(el?.textContent || "");
            window.MONACO_CONTAINER = el?.textContent;
            window.MONACO_UPDATE = true;
          }}
          className="bg-blue-400 p-2 rounded-md"
        >
          Refresh
        </button>
      </div>
    </>
  );
}
4;
