"use client";

import React, { useTransition, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { BaseSnippet } from "@/db/schema";
import { Button } from "../../../components/ui/button";
import {
  ExternalLink,
  Globe,
  SquarePen,
  Trash2,
  UserLock,
  Users,
  FileCode,
  Clock,
} from "lucide-react";
import { deleteSnippet } from "@/actions/snippets.action";
import Link from "next/link";
import { toast } from "sonner";
import { Timestamp } from "@/lib/day";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

const visibilityIcon = {
  public: <Globe size={14} />,
  private: <UserLock size={14} />,
  connections: <Users size={14} />,
};

const visibilityColors = {
  public: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  private: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  connections: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

interface SnippetCardProps {
  snippet: BaseSnippet;
  onDelete: (val: number) => void;
}

const SnippetCard = ({ snippet, onDelete }: SnippetCardProps) => {
  const [deleting, startDeleting] = useTransition();
  const [open, setOpen] = useState(false);
  
  const getLanguages = (snippet: BaseSnippet) => {
    const newLanguages = snippet.files?.map((i) => {
      return i.language;
    });
    let netSet = new Set(newLanguages);
    return [...netSet];
  };

  const deleteSingleSnippet = async (id: number) => {
    startDeleting(async () => {
      const result = await deleteSnippet(id);
      if (result.error) {
        toast.error(result.message || "Failed to delete snippet");
        setOpen(false);
      } else {
        toast.success(result.message || "Snippet deleted successfully");
        setOpen(false);
        onDelete(id);
      }
    });
  };

  const languages = getLanguages(snippet);
  const fileCount = snippet.files?.length || 0;
  const visibility = snippet.visibility || "private";

  return (
    <Card className="col-span-1 w-full min-w-0 group hover:shadow-lg transition-all duration-300 hover:border-primary/50 border-2">
      <CardHeader className="pb-4">
        <CardTitle 
          className="text-lg font-semibold group-hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap block min-w-0 pr-2"
          title={snippet.title}
        >
          {snippet.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
              visibilityColors[visibility]
            )}
          >
            {visibilityIcon[visibility]}
            <span className="capitalize">{visibility}</span>
          </span>
        </CardDescription>
        <CardAction className="gap-1.5 flex shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
              asChild
            >
              <Link href={`/dashboard/snippets/${snippet.shareId}`}>
                <SquarePen size={16} />
              </Link>
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  disabled={deleting}
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the snippet
                    <span className="font-semibold"> "{snippet.title}"</span> and all of its files.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteSingleSnippet(snippet.id)}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        
      </CardHeader>
      <CardContent className="space-y-4">
        {languages && languages.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Languages
            </p>
            <div className="flex flex-wrap gap-1.5">
              {languages.slice(0, 3).map((lang, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-colors"
                >
                  {lang}
                </span>
              ))}
              {languages.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                  +{languages.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileCode size={14} />
            <span className="text-xs">
              {fileCount} {fileCount === 1 ? "file" : "files"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>{Timestamp(snippet.updatedAt)}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
          asChild
        >
          <Link href={`/snippet/view/${snippet.shareId}`} target="_blank">
            <span className="text-xs">View</span>
            <ExternalLink size={14} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SnippetCard;
