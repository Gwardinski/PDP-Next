"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export const AuthButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button variant={"outline"} onClick={() => signOut()}>
        Sign out
      </Button>
    );
  }
  return (
    <Button variant={"outline"} onClick={() => signIn()}>
      Sign in
    </Button>
  );
};
