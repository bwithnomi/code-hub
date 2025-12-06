"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { deleteUserAccount } from "@/actions/user.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AccountSettings() {
  const { user, isLoaded } = useUser();
  const [isDeleting, startDeleting] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startDeleting(async () => {
      const result = await deleteUserAccount();
      if (result.error) {
        toast.error(result.message || "Failed to delete account");
        setShowConfirm(false);
      } else {
        toast.success("Account deleted successfully");
        // Redirect to home page after deletion
        router.push("/");
      }
    });
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account & Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account & Profile</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-medium">Name</div>
          <div className="text-sm text-muted-foreground">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.fullName || "Not set"}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Email</div>
          <div className="text-sm text-muted-foreground">
            {user?.emailAddresses[0]?.emailAddress || "Not set"}
          </div>
        </div>

        {user?.createdAt && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Account Created</div>
            <div className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. This will permanently delete
                your account, snippets, and all associated data.
              </p>
            </div>
            {showConfirm && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
                <p className="text-sm text-destructive font-medium mb-2">
                  Are you absolutely sure?
                </p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. All your snippets and data will be permanently
                  deleted.
                </p>
              </div>
            )}
            <Button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting
                ? "Deleting..."
                : showConfirm
                ? "Confirm Deletion"
                : "Delete Account"}
            </Button>
            {showConfirm && (
              <Button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

