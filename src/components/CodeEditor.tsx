"use client"

import Editor, { OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes";
import { useRef, useEffect } from "react";
import type { editor } from "monaco-editor";
import type * as monaco from "monaco-editor";

interface editorProps  {
    code: string;
    onChange: (val: string) => void;
    language: string;
    fontSize?: number;
    editorTheme?: string;
}

const CodeEditor = ({code, onChange, language, fontSize, editorTheme}: editorProps) => {
    const {theme} = useTheme();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof monaco | null>(null);
    
    // Determine editor theme: use prop if provided, otherwise fallback to app theme
    const monacoTheme = editorTheme || (theme === "dark" ? "vs-dark" : "vs-light");
    const editorFontSize = fontSize || 14;
    
    // Update language when it changes
    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                // Update the language of the model
                monacoRef.current.editor.setModelLanguage(model, language);
            }
        }
    }, [language]);

    // Update theme when it changes
    useEffect(() => {
        if (monacoRef.current) {
            monacoRef.current.editor.setTheme(monacoTheme);
        }
    }, [monacoTheme]);

    // Ensure language is set correctly when content changes (especially when loading async content)
    useEffect(() => {
        if (editorRef.current && monacoRef.current && code) {
            const model = editorRef.current.getModel();
            if (model) {
                // Ensure language is set, which triggers re-tokenization
                const currentLang = model.getLanguageId();
                if (currentLang !== language) {
                    monacoRef.current.editor.setModelLanguage(model, language);
                }
            }
        }
    }, [code, language]);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        // Ensure the language is set correctly on mount
        const model = editor.getModel();
        if (model) {
            monaco.editor.setModelLanguage(model, language);
        }
    };
    
  return (
    <div className="w-full">
        <Editor 
            height="300px" 
            value={code} 
            language={language} 
            onChange={(value) => onChange(value || "")} 
            theme={monacoTheme}
            onMount={handleEditorDidMount}
            options={{
                fontSize: editorFontSize,
                automaticLayout: true,
            }}
        />
    </div>
  )
}

export default CodeEditor