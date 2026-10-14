"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import type { AdminUser } from "@/lib/admin/api";
import { useAccount } from "@/lib/admin/hooks/useAccount";
import type { SaveStatus } from "@/lib/admin/hooks/useContentArea";
import { Button } from "../../_components/Button";
import { Card, PageHeader } from "../../_components/EditorShell";
import { ErrorPanel } from "../../_components/ErrorPanel";
import { Field } from "../../_components/Field";

const SavedNote = ({ status, text }: { status: SaveStatus; text: string }) =>
  status.kind === "saved" ? (
    <span role="status" className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f8ef] px-3 py-1 text-sm font-semibold text-[#17803d]">
      <Check className="size-4" />
      {text}
    </span>
  ) : null;

type AccountApi = ReturnType<typeof useAccount>;

// Mounted once the user loads, so fields seed from props instead of syncing state in an effect.
const AccountForm = ({ user, saveProfile, savePassword, profileStatus, passwordStatus }: AccountApi & { user: AdminUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onChangePassword = async () => {
    if (await savePassword(currentPassword, newPassword)) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <>
      <Card className="mt-8">
        <h2 className="font-display text-ink text-lg font-semibold">Profile</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Name" required autoComplete="name" value={name} onChange={setName} />
          <Field label="Email" type="email" required autoComplete="email" value={email} onChange={setEmail} />
        </div>
        {profileStatus.kind === "error" && (
          <div className="mt-5">
            <ErrorPanel message={profileStatus.message} issues={profileStatus.issues} />
          </div>
        )}
        <div className="mt-6 flex items-center gap-4">
          <Button onClick={() => saveProfile(name, email)} disabled={profileStatus.kind === "saving"}>
            {profileStatus.kind === "saving" && <LoaderCircle className="size-4 animate-spin" />}
            Save profile
          </Button>
          <SavedNote status={profileStatus} text="Profile updated" />
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="font-display text-ink text-lg font-semibold">Password</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Current password" type="password" required autoComplete="current-password" value={currentPassword} onChange={setCurrentPassword} />
          <Field label="New password" type="password" required autoComplete="new-password" value={newPassword} onChange={setNewPassword} hint="At least 8 characters." />
        </div>
        {passwordStatus.kind === "error" && (
          <div className="mt-5">
            <ErrorPanel message={passwordStatus.message} issues={passwordStatus.issues} />
          </div>
        )}
        <div className="mt-6 flex items-center gap-4">
          <Button onClick={onChangePassword} disabled={passwordStatus.kind === "saving" || !currentPassword || !newPassword}>
            {passwordStatus.kind === "saving" && <LoaderCircle className="size-4 animate-spin" />}
            Change password
          </Button>
          <SavedNote status={passwordStatus} text="Password changed" />
        </div>
      </Card>
    </>
  );
};

const AccountPage = () => {
  const account = useAccount();

  return (
    <div className="max-w-3xl">
      <PageHeader title="Account" description="Your name, email and password." />
      {account.user ? (
        <AccountForm {...account} user={account.user} />
      ) : account.profileStatus.kind === "error" ? (
        <div className="mt-8">
          <ErrorPanel message={account.profileStatus.message} />
        </div>
      ) : (
        <Card className="mt-8">
          <div className="h-24 animate-pulse rounded-xl bg-[#f0f2f8]" aria-busy="true" aria-label="Loading" />
        </Card>
      )}
    </div>
  );
};

export default AccountPage;
