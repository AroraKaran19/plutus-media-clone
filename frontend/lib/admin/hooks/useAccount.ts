"use client";

import { useCallback, useEffect, useState } from "react";
import { changePassword, getMe, updateProfile, type AdminUser } from "@/lib/admin/api";
import { toErrorStatus, type SaveStatus } from "./useContentArea";

export const useAccount = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [profileStatus, setProfileStatus] = useState<SaveStatus>({ kind: "idle" });
  const [passwordStatus, setPasswordStatus] = useState<SaveStatus>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch((error: unknown) => {
        if (!cancelled) setProfileStatus(toErrorStatus(error, "Could not load your account"));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveProfile = useCallback(async (name: string, email: string) => {
    setProfileStatus({ kind: "saving" });
    try {
      setUser(await updateProfile({ name, email }));
      setProfileStatus({ kind: "saved" });
    } catch (error) {
      setProfileStatus(toErrorStatus(error, "Could not update"));
    }
  }, []);

  const savePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setPasswordStatus({ kind: "saving" });
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordStatus({ kind: "saved" });
      return true;
    } catch (error) {
      setPasswordStatus(toErrorStatus(error, "Could not change password"));
      return false;
    }
  }, []);

  return { user, saveProfile, savePassword, profileStatus, passwordStatus };
};
