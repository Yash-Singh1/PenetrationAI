"use client";

import MonacoEditor from "react-monaco-editor";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import { useState, useEffect } from "react";
// @ts-expect-error -- monaco-editor doesnt type main implementation of langs
import { conf } from "monaco-editor/esm/vs/basic-languages/python/python";

export default function Editor() {
  return (
    <>
      <div>
        <MonacoEditor
          language="python"
          value="print('Hello World!')"
          className="min-h-[calc(100vh-7rem)] w-full"
          theme="vs-dark"
          options={conf}
        ></MonacoEditor>
      </div>
    </>
  );
}
4;
