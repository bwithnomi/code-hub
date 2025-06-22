"use server";

import { ServerResponse } from "@/app/dto/response.dto";
import { db } from "@/db";
import {
  snippets,
  NewSnippet as NewSnippetDb,
  files,
  Snippet,
  snippetViews,
} from "@/db/schema";
import {
  NewSnippet,
  snippetSchema,
  snippetUpdateSchema,
  UpdateSnippet,
} from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const getAllSnippets = async () => {
  const snippetWithFiles = await db.query.snippets.findMany({
    orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
    with: {
      files: true,
    },
    limit: 5,
  });

  return snippetWithFiles;
};

export const getMySnippets = async () => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: (users, { eq }) => {
      return eq(users.clerkId, userId);
    },
  });
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const snippetWithFiles = await db.query.snippets.findMany({
    orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
    with: {
      files: true,
    },
    where: (snippets, { eq }) => {
      return eq(snippets.userId, user.id);
    },
    limit: 5,
  });
  return {
    error: false,
    status: 200,
    message: "Success",
    data: snippetWithFiles,
  };
};

export const saveSnippet = async (
  data: NewSnippet
): Promise<ServerResponse<NewSnippetDb | null>> => {
  const validateData = snippetSchema.safeParse(data);

  if (!validateData.success) {
    let errorMessage = "";
    validateData.error.issues.forEach((i) => {
      errorMessage = errorMessage + i.message + ". \b";
    });

    return {
      error: true,
      status: 422,
      message: errorMessage,
      data: null,
    };
  }
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: (users, { eq }) => {
      return eq(users.clerkId, userId);
    },
  });
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const id = crypto.randomUUID();
  const newSnippet = await db
    .insert(snippets)
    .values({
      title: data.title,
      visibility: data.visibility,
      userId: user?.id,
      shareId: id,
    })
    .returning();

  for (let index = 0; index < data.files.length; index++) {
    const file = data.files[index];
    await db.insert(files).values({
      name: `${data.title}-${id}`,
      language: file.language,
      code: file.content,
      snippetId: newSnippet[0].id,
    });
  }

  return {
    error: true,
    status: 200,
    message: "Success",
    data: newSnippet[0],
  };
};

export const deleteSnippet = async (id: number) => {
  const result = await db.delete(snippets).where(eq(snippets.id, id));
  return result ? true : false;
};
export const getSnippetByShareId = async (shareId: string) => {
  const snippet = await db.query.snippets.findFirst({
    with: {
      files: true,
    },
    where: (snippets, { eq }) => {
      return eq(snippets.shareId, shareId);
    },
  });

  return snippet;
};
export const viewSnippetByShareId = async (shareId: string) => {
  const { userId } = await auth();
  const [snippet, user] = await Promise.all([
    db.query.snippets.findFirst({
      with: {
        files: true,
      },
      where: (snippets, { eq }) => {
        return (
          eq(snippets.shareId, shareId) && eq(snippets.visibility, "public")
        );
      },
    }),
    await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: (users, { eq }) => {
        return eq(users.clerkId, userId || "");
      },
    }),
  ]);

  if (!snippet) return undefined;

  if (user) {

    const view = await db.query.snippetViews
      .findFirst({
        where: (snippetViews, { eq, and }) => {
          return and(
            eq(snippetViews.viewerId, user.id),
            eq(snippetViews.snippetId, snippet.id)
          );
        },
      });

    if (!view) {
      await db.insert(snippetViews).values({
        snippetId: snippet.id,
        viewerId: user.id,
        ownerId: snippet.userId,
      });
    }
  }

  const views = db.$count(snippetViews, eq(snippetViews.snippetId, snippet.id));

  return { snippet, views };
};

export const getRecentSnippets = async () => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: (users, { eq }) => {
      return eq(users.clerkId, userId);
    },
  });
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const snippetWithFiles = await db.query.snippets.findMany({
    columns: {
      visibility: true,
      title: true,
      updatedAt: true,
      id: true,
      shareId: true,
    },
    where: (snippets, { eq }) => {
      return eq(snippets.userId, user.id);
    },
    orderBy: (snippets, { desc }) => [desc(snippets.updatedAt)],
    limit: 5,
  });
  return {
    error: false,
    status: 200,
    message: "success",
    data: snippetWithFiles,
  };
};

export const getSnippetCount = async () => {
  const { userId } = await auth();
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: (users, { eq }) => {
      return eq(users.clerkId, userId!);
    },
  });
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthorized",
      data: null,
    };
  }
  const count = db.$count(snippets, eq(snippets.userId, user.id));
  return {
    error: false,
    status: 200,
    message: "",
    data: {
      count,
    },
  };
};

export const updateSnippet = async (data: UpdateSnippet) => {
  const validateData = snippetUpdateSchema.safeParse(data);

  if (!validateData.success) {
    let errorMessage = "";
    validateData.error.issues.forEach((i) => {
      errorMessage = errorMessage + i.message + ". \b";
    });

    return {
      error: true,
      status: 422,
      message: errorMessage,
      data: null,
    };
  }
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const snippet = await getSnippetByShareId(data.shareId);

  if (!snippet) {
    return {
      error: true,
      status: 404,
      message: "Snippet not found",
      data: null,
    };
  }

  await Promise.all([
    db
      .update(snippets)
      .set({
        title: data.title,
        visibility: data.visibility,
        updatedAt: new Date(),
      })
      .where(eq(snippets.shareId, snippet.shareId)),
    db.delete(files).where(eq(files.snippetId, snippet.id)),
  ]);

  for (let index = 0; index < data.files.length; index++) {
    const file = data.files[index];
    await db.insert(files).values({
      name: `${data.title}-${snippet.shareId}`,
      language: file.language,
      code: file.content,
      snippetId: snippet.id,
    });
  }

  return {
    error: true,
    status: 200,
    message: "Success",
    data: snippet,
  };
};
