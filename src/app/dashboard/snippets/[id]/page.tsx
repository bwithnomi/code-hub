"use client";

import {
  getSnippetByShareId,
  saveSnippet,
  updateSnippet,
} from "@/actions/snippets.action";
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
import { Skeleton } from "@/components/ui/skeleton";
import { BaseSnippet } from "@/db/schema";
import {
  NewSnippet,
  snippetSchema,
  snippetUpdateSchema,
  UpdateSnippet,
} from "@/lib/zodSchema";
import { Delete } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast, Toaster } from "sonner";

const codingLanguages = [
  "javascript",
  "python",
  "typescript",
  "tsx",
  "jsx",
  "java",
  "php",
  "yaml",
  "html",
  "css",
  "go",
  "json",
  "plaintext",
  "ruby",
  "rust",
  "xml",
];

const page = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState<BaseSnippet | null>(null);
  const [saving, startSaving] = useTransition();
  const [loading, startLoading] = useTransition();
  const [visibility, setVisibility] = useState<string | undefined>();
  const [title, setTitle] = useState<string>("");
  const [files, setFiles] = useState([{ language: "javascript", content: "" }]);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      return;
    }
    startLoading(async () => {
      getSnippetByShareId(id.toString()).then((res) => {
        if (!res) {
          return;
        }
        setSnippet(res);
        setTitle(res.title);
        setVisibility(res.visibility || undefined);

        let tmpFiles = res.files.map((f) => {
          return {
            language: f.language,
            content: f.code,
          };
        });
        setFiles(tmpFiles);
      });
    });
  }, []);

  const clientAction = async () => {
    startSaving(async () => {
      const result = snippetUpdateSchema.safeParse({
        shareId: snippet?.shareId,
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
      const res = await updateSnippet(result.data as UpdateSnippet);

      if (res.data) {
        toast.info("Snippet updated");
      } else {
        toast.error(res.message);
      }
    });
  };

  const addToFiles = () => {
    const tmpFiles = [...files];
    tmpFiles.push({
      language: "javascript",
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

  if (!snippet) {
    return (
      <div className="w-full top-0 px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="w-80">
            <Skeleton className="w-full h-[40] rounded-full"></Skeleton>
          </div>
          <div className="flex justify-end items-center gap-2">
            <Skeleton className="w-[120] h-[40] rounded-xl"></Skeleton>
            <Skeleton className="w-[60] h-[40] rounded-xl"></Skeleton>
            <Skeleton className="w-[80] h-[40] rounded-xl"></Skeleton>
          </div>
        </div>
        <div className="flex">
          <div className="mt-4 px-8 w-full">
            <div className="">
              <Skeleton className="w-[240] h-[40] rounded-xl"></Skeleton>
            </div>
            <div className="mt-4">
              <Skeleton className="w-full h-[300] rounded-xl"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={clientAction}
      className="flex flex-col overflow-hidden absolute h-full w-full top-0 px-6 py-6"
    >
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <div className="w-80">
          <EditableText
            value={title}
            onChange={(val) => setTitle(val)}
            className="font-bold text-xl"
          ></EditableText>
        </div>
        <div className="flex justify-end items-center gap-2">
          <Select
            onValueChange={(value) => setVisibility(value)}
            defaultValue={visibility}
            disabled={saving}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Change Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Visibility</SelectLabel>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                {/* <SelectItem value="connections">
                    Connections
                  </SelectItem> */}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={saving}>
            Save
          </Button>
          <Button
            onClick={() => {
              addToFiles();
            }}
            type="button"
            disabled={files.length >= 3}
          >
            Add New
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-scroll">
        {files.map((file, index) => (
          <div className="mt-4 px-8" key={`${file.language}-${index}`}>
            <div className="flex justify-between">
              <Select
                onValueChange={(value) => updateFile(index, "language", value)}
                defaultValue={file.language}
                disabled={saving}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    {codingLanguages.map((lang) => (
                      <SelectItem value={lang} key={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {index > 0 && (
                <Button
                  onClick={() => {
                    deleteFromFiles(index);
                  }}
                  type="button"
                  variant="destructive"
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
              ></CodeEditor>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default page;
