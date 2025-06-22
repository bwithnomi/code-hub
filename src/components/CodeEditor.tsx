"use client"

import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes";

interface editorProps  {
    code: string;
    onChange: (val: string) => void;
    language: string
}

const CodeEditor = ({code, onChange, language}: editorProps) => {
    const {theme} = useTheme();
  return (
    <div>
        <Editor height="300px" defaultValue={code} defaultLanguage={language} language={language} onChange={(value) => onChange(value || "")} theme={theme == "dark" ? "vs-light" : "vs-dark"}></Editor>
    </div>
  )
}

export default CodeEditor