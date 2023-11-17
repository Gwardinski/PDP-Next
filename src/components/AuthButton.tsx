"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const AuthButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        className="h-12 border rounded-sm border-neutral-500 text-lg min-w-fit px-4 text-white"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    );
  }
  return (
    <button
      className="h-12 border rounded-sm border-neutral-500 text-lg min-w-fit px-4 text-white"
      onClick={() => signIn()}
    >
      Sign in
    </button>
  );
};
