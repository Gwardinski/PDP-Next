import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "../components/SessionProvider";

import { AuthButton } from "../components/AuthButton";
import { AppRoute, Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Gordon Macintyre - PDP",
  description: "PDP Playground",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <body className="flex h-full min-h-screen flex-col overflow-x-hidden overflow-y-scroll bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950">
            <Navigation />
            <main className="flex w-full max-w-7xl flex-col self-center px-2 pt-12">
              {children}
            </main>
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
}
