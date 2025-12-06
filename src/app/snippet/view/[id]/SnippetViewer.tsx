"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Copy, Check, Eye, FileCode, Globe, UserLock, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Timestamp } from "@/lib/day";

const visibilityIcon = {
  public: <Globe size={16} />,
  private: <UserLock size={16} />,
  connections: <Users size={16} />,
};

const visibilityColors = {
  public: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  private: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  connections: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

interface File {
  id: number;
  language: string;
  code: string;
  name?: string;
}

interface SnippetViewerProps {
  title: string;
  files: File[];
  viewsCount: number;
  visibility: "public" | "private" | "connections";
  updatedAt: Date;
}

const SnippetViewer = ({ title, files, viewsCount, visibility, updatedAt }: SnippetViewerProps) => {
  const { theme } = useTheme();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editorHeight, setEditorHeight] = useState(300);
  const [fontSize, setFontSize] = useState(12);
  const [padding, setPadding] = useState({ top: 12, bottom: 12, left: 12, right: 12 });
  // Use softer themes: github-dark for dark mode, soft-light for light mode
  const monacoTheme = theme === "dark" ? "github-dark" : "soft-light";

  // Set responsive editor height and options
  useEffect(() => {
    const updateResponsive = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          setEditorHeight(450);
          setFontSize(14);
          setPadding({ top: 20, bottom: 20, left: 16, right: 16 });
        } else if (window.innerWidth >= 640) {
          setEditorHeight(400);
          setFontSize(14);
          setPadding({ top: 20, bottom: 20, left: 16, right: 16 });
        } else {
          setEditorHeight(300);
          setFontSize(12);
          setPadding({ top: 12, bottom: 12, left: 12, right: 12 });
        }
      }
    };

    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => window.removeEventListener("resize", updateResponsive);
  }, []);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-6 md:p-8 shadow-lg">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Code Snippet</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 break-words text-foreground">
                {title}
              </CardTitle>
            </div>
            <div className="flex-shrink-0 self-start sm:self-auto">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border-2 shadow-sm transition-all hover:scale-105",
                  visibilityColors[visibility]
                )}
              >
                {visibilityIcon[visibility]}
                <span className="capitalize">{visibility}</span>
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-background/80 backdrop-blur-sm border shadow-sm text-sm sm:text-base">
              <Eye size={16} className="sm:w-[18px] sm:h-[18px] text-primary flex-shrink-0" />
              <span className="font-semibold text-foreground">{viewsCount}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{viewsCount === 1 ? "view" : "views"}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-background/80 backdrop-blur-sm border shadow-sm text-sm sm:text-base">
              <FileCode size={16} className="sm:w-[18px] sm:h-[18px] text-primary flex-shrink-0" />
              <span className="font-semibold text-foreground">{files.length}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{files.length === 1 ? "file" : "files"}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-background/80 backdrop-blur-sm border shadow-sm text-sm sm:text-base">
              <Calendar size={16} className="sm:w-[18px] sm:h-[18px] text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Updated {Timestamp(updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Files */}
      <div className="space-y-4 sm:space-y-6">
        {files.map((file, index) => (
          <Card key={file.id} className="border-2 overflow-hidden shadow-xl bg-card hover:shadow-2xl transition-all duration-300 rounded-lg">
            {/* macOS-style window header */}
            <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-b from-muted/30 to-muted/10 border-b-2 px-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                {/* Left: macOS traffic lights */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] shadow-sm"></div>
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm"></div>
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#28c940] border border-[#1aab29] shadow-sm"></div>
                </div>
                
                {/* Center: File name */}
                <div className="flex-1 min-w-0 text-center">
                  <CardTitle className="text-sm sm:text-base font-medium text-foreground truncate">
                    {file.name || `file.${file.language}`}
                  </CardTitle>
                </div>
                
                {/* Right: Language badge and Copy button */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold bg-secondary/80 text-secondary-foreground border border-border/50">
                    {file.language}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 sm:h-8 px-2 sm:px-3 gap-1.5 hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => copyToClipboard(file.code, index)}
                  >
                    {copiedIndex === index ? (
                      <Check size={14} className="sm:w-4 sm:h-4" />
                    ) : (
                      <Copy size={14} className="sm:w-4 sm:h-4" />
                    )}
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                      {copiedIndex === index ? "Copied" : "Copy"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-gradient-to-b from-muted/10 to-background">
              <div className="border-t border-border/50">
                <Editor
                  height={`${editorHeight}px`}
                  language={file.language}
                  value={file.code}
                  theme={monacoTheme}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: fontSize,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    padding: padding,
                    renderLineHighlight: "all",
                  }}
                  beforeMount={(monaco) => {
                    // Define soft-light theme for easier viewing
                    monaco.editor.defineTheme("soft-light", {
                      base: "vs",
                      inherit: true,
                      rules: [],
                      colors: {
                        "editor.background": "#f8f9fa",
                        "editor.foreground": "#24292e",
                        "editorLineNumber.foreground": "#6a737d",
                        "editor.selectionBackground": "#c8e1ff",
                        "editor.lineHighlightBackground": "#f6f8fa",
                        "editorCursor.foreground": "#24292e",
                      },
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SnippetViewer;

