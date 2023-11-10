"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const AuthButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <button className="h-10 bg-neutral-800 px-4" onClick={() => signOut()}>
        Sign out
      </button>
    );
  }
  return (
    <button className="h-10 bg-neutral-800 px-4" onClick={() => signIn()}>
      Sign in
    </button>
  );
};
