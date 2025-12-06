import { getSnippetByShareId } from "@/actions/snippets.action";
import { getUserPreferences } from "@/actions/user-preferences.action";
import EditSnippetEditor from "./EditSnippetEditor";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Fetch snippet and preferences in parallel on the server
  const [snippet, prefsResult] = await Promise.all([
    getSnippetByShareId(id),
    getUserPreferences(),
  ]);

  // If snippet not found, redirect to snippets page
  if (!snippet) {
    redirect("/dashboard/snippets");
  }

  const editorFontSize = prefsResult.data?.editorFontSize || 14;
  const editorTheme = prefsResult.data?.editorTheme || "vs-dark";
  const aiTitleGenerationEnabled = prefsResult.data?.aiTitleGenerationEnabled ?? true;

  return (
    <EditSnippetEditor
      snippet={snippet}
      editorFontSize={editorFontSize}
      editorTheme={editorTheme}
      aiTitleGenerationEnabled={aiTitleGenerationEnabled}
    />
  );
};

export default page;
