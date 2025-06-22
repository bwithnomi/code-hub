"use client";

import React, { useTransition } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BaseSnippet } from "@/db/schema";
import { Button } from "./ui/button";
import {
  ExternalLink,
  Globe,
  SquarePen,
  Trash2,
  UserLock,
  Users,
} from "lucide-react";
import { deleteSnippet } from "@/actions/snippets.action";
import Link from "next/link";

const visibilityIcon = {
  public: <Globe size={12} />,
  private: <UserLock size={12} />,
  connections: <Users size={12} />,
};

interface SnippetCardProps {
  snippet: BaseSnippet;
  onDelete: (val: number) => void;
}

const SnippetCard = ({ snippet, onDelete }: SnippetCardProps) => {
  const [deleting, startDeleting] = useTransition();
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
      onDelete(id);
    });
  };
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="w-40 truncate">{snippet.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          {snippet.visibility} {visibilityIcon[snippet.visibility!]}{" "}
        </CardDescription>
        <CardAction className="gap-2 flex">
          <Button className="cursor-pointer">
            <Link href={`/dashboard/snippets/${snippet.shareId}`}>
              <SquarePen />
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => deleteSingleSnippet(snippet.id)}
            disabled={deleting}
          >
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>
          Languages:{" "}
          {getLanguages(snippet)?.map((i, index) => {
            return index == 0 ? i : ", " + i;
          })}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between cursor-pointer">
        <p className="text-sm">
          Last Edited:{" "}
          <span className="font-bold text-slate-500">
            {snippet.updatedAt.toDateString()}
          </span>
        </p>
        <Button>
          <Link href={`/snippet/view/${snippet.shareId}`} target="blank">
            <ExternalLink />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SnippetCard;
