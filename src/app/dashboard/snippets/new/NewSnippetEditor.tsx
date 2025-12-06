"use client";

import { saveSnippet } from "@/actions/snippets.action";
import { generateSnippetTitle } from "@/actions/ai.action";
import CodeEditor from "@/components/CodeEditor";
import { EditableText } from "@/components/EditableText";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewSnippet, snippetSchema } from "@/lib/zodSchema";
import { ArrowLeft, CirclePlus, Delete, Save, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast, Toaster } from "sonner";
import { codingLanguages, languageGroups } from "@/app/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

interface NewSnippetEditorProps {
  defaultLanguage: string;
  aiTitleGenerationEnabled: boolean;
  editorFontSize: number;
  editorTheme: string;
  snippetCount: number;
  maxSnippets: number;
}

export default function NewSnippetEditor({
  defaultLanguage,
  aiTitleGenerationEnabled,
  editorFontSize,
  editorTheme,
  snippetCount,
  maxSnippets,
}: NewSnippetEditorProps) {
  const [saving, startSaving] = useTransition();
  const [generatingTitle, setGeneratingTitle] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<string>("public");
  const [title, setTitle] = useState<string>("");
  const [files, setFiles] = useState([{ language: defaultLanguage, content: "" }]);
  const router = useRouter();

  const clientAction = async () => {
    startSaving(async () => {
      const result = snippetSchema.safeParse({
        title,
        visibility,
        files: [...files],
      });

      if (!result.success) {
        let errorMessage = "";
        result.error.issues.forEach((i) => {
          errorMessage = errorMessage + i.message + ". \b";
        });
        toast.error(errorMessage);

        return;
      }
      const res = await saveSnippet(result.data as NewSnippet);

      if (res.data) {
        toast.info("Snippet saved");
        router.push("/dashboard/snippets");
      } else {
        toast.error(res.message);
      }
    });
  };

  const addToFiles = () => {
    const tmpFiles = [...files];
    tmpFiles.push({
      language: defaultLanguage,
      content: "",
    });
    setFiles(tmpFiles);
  };

  const deleteFromFiles = (index: number) => {
    const tmpFiles = [...files];
    tmpFiles.splice(index, 1);
    setFiles(tmpFiles);
  };

  const updateFile = (
    i: number,
    key: "language" | "content",
    value: string
  ) => {
    const newFiles = [...files];
    newFiles[i][key] = value;
    setFiles(newFiles);
  };

  const handleGenerateTitle = async () => {
    // Check if there's any code content
    const hasContent = files.some((file) => file.content.trim().length > 0);
    if (!hasContent) {
      toast.error("Please add some code before generating a title.");
      return;
    }

    setGeneratingTitle(true);
    try {
      const result = await generateSnippetTitle(files);
      if (result.error || !result.data) {
        toast.error(result.message || "Failed to generate title");
      } else {
        setTitle(result.data);
        toast.success("Title generated successfully!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setGeneratingTitle(false);
    }
  };

  // Check if there's any code content for disabling the button
  const hasCodeContent = files.some((file) => file.content.trim().length > 0);

  return (
    <form
      action={clientAction}
      className="flex flex-col overflow-hidden h-full w-full px-3 sm:px-6 py-4 sm:py-6"
    >
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 pb-4 border-b">
        {/* Top Row: Navigation and Title */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer shrink-0"
            asChild
          >
            <Link href="/dashboard/snippets">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Back</span>
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <EditableText
              value={title}
              onChange={(val) => setTitle(val)}
              className="font-semibold text-xl sm:text-2xl"
              placeholder="Click to edit Snippet Title"
            />
          </div>
          {aiTitleGenerationEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={handleGenerateTitle}
                    disabled={generatingTitle || !hasCodeContent || saving}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer shrink-0"
                  >
                    <WandSparkles className={`h-4 w-4 ${generatingTitle ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline ml-2">Generate Title</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate title using AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) => setVisibility(value)}
              defaultValue={visibility}
              disabled={saving}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Visibility</SelectLabel>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={() => {
                        if (files.length >= 3) {
                          toast.error("Free tier users can have a maximum of 3 editors per snippet. Please upgrade to add more editors.");
                          return;
                        }
                        addToFiles();
                      }}
                      type="button"
                      disabled={files.length >= 3 || saving}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <CirclePlus className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Add Editor</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                {files.length >= 3 && (
                  <TooltipContent>
                    <p>Free tier limit: Maximum 3 editors per snippet</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button 
            type="submit" 
            disabled={saving} 
            className="cursor-pointer w-full sm:w-auto"
            size="sm"
          >
            <Save className="h-4 w-4" />
            <span className="ml-2">Save Snippet</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-scroll mt-6">
        {files.map((file, index) => (
          <div className="mt-6 px-2 sm:px-8" key={`${file.language}-${index}`}>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Select
                onValueChange={(value) => updateFile(index, "language", value)}
                defaultValue={file.language}
                disabled={saving}
              >
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {Object.entries(languageGroups).map(([groupName, languages]) => (
                    <SelectGroup key={groupName}>
                      <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-2">
                        {groupName}
                      </SelectLabel>
                      {languages.map((lang) => (
                        <SelectItem value={lang} key={lang} className="pl-4">
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {index > 0 && (
                <Button
                  onClick={() => {
                    deleteFromFiles(index);
                  }}
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <Delete></Delete>
                  Delete
                </Button>
              )}
            </div>
            <div className="mt-4">
              <CodeEditor
                code={file.content}
                onChange={(val) => {
                  updateFile(index, "content", val);
                }}
                language={file.language}
                fontSize={editorFontSize}
                editorTheme={editorTheme}
              ></CodeEditor>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}

