import { getMySnippetCount } from "@/actions/snippets.action";
import { getUserPreferences } from "@/actions/user-preferences.action";
import NewSnippetEditor from "./NewSnippetEditor";

export const dynamic = 'force-dynamic';

export default async function page() {
  // Fetch preferences and snippet count in parallel on the server
  const [prefsResult, countResult] = await Promise.all([
    getUserPreferences(),
    getMySnippetCount(),
  ]);

  const defaultLanguage = prefsResult.data?.defaultLanguage || "javascript";
  const aiTitleGenerationEnabled = prefsResult.data?.aiTitleGenerationEnabled ?? true;
  const editorFontSize = prefsResult.data?.editorFontSize || 14;
  const editorTheme = prefsResult.data?.editorTheme || "vs-dark";
  const snippetCount = countResult.data?.count || 0;
  const maxSnippets = countResult.data?.maxSnippets || Infinity;

  return (
    <NewSnippetEditor
      defaultLanguage={defaultLanguage}
      aiTitleGenerationEnabled={aiTitleGenerationEnabled}
      editorFontSize={editorFontSize}
      editorTheme={editorTheme}
      snippetCount={snippetCount}
      maxSnippets={maxSnippets}
    />
  );
}
