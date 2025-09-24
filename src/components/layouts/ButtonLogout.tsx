"use client";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

export function LogoutButton({ collapsed }: { collapsed: boolean }) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <FiLogOut />
      {!collapsed && "Logout"}
    </button>
  );
}
