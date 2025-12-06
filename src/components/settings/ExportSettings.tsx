"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { exportSnippetsAsJson, exportSnippetsAsZip } from "@/actions/export.action";
import { getMySnippetCount } from "@/actions/snippets.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileJson, Archive } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExportSettings() {
  const [isExportingJson, startJsonExport] = useTransition();
  const [isExportingZip, startZipExport] = useTransition();
  const [snippetCount, setSnippetCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Only load once, prevent re-renders
    if (hasLoaded.current) return;
    
    async function loadCount() {
      try {
        const result = await getMySnippetCount();
        if (!result.error && result.data) {
          setSnippetCount(result.data.count);
        }
      } catch (error) {
        console.error("Error loading snippet count:", error);
      } finally {
        setLoading(false);
        hasLoaded.current = true;
      }
    }
    loadCount();
  }, []);

  const handleJsonExport = () => {
    startJsonExport(async () => {
      const result = await exportSnippetsAsJson();
      if (result.error || !result.data) {
        toast.error(result.message || "Failed to export snippets");
        return;
      }

      // Create download
      const blob = new Blob([result.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snippets-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Snippets exported as JSON");
    });
  };

  const handleZipExport = () => {
    startZipExport(async () => {
      const result = await exportSnippetsAsZip();
      if (result.error || !result.data) {
        toast.error(result.message || "Failed to export snippets");
        return;
      }

      // Convert base64 to blob and download
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snippets-export-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Snippets exported as ZIP");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data & Export</CardTitle>
        <CardDescription>Export your snippets for backup or migration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <Skeleton className="h-5 w-48" />
        ) : snippetCount !== null ? (
          <div className="text-sm text-muted-foreground">
            You have {snippetCount} snippet{snippetCount !== 1 ? "s" : ""} in your account
          </div>
        ) : null}

        <div className="space-y-4">
          <Button
            onClick={handleJsonExport}
            disabled={isExportingJson || isExportingZip}
            variant="outline"
            className="w-full"
          >
            <FileJson className="h-4 w-4" />
            {isExportingJson ? "Exporting..." : "Export as JSON"}
          </Button>

          <Button
            onClick={handleZipExport}
            disabled={isExportingJson || isExportingZip}
            variant="outline"
            className="w-full"
          >
            <Archive className="h-4 w-4" />
            {isExportingZip ? "Exporting..." : "Export as ZIP"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

