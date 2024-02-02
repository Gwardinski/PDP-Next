"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export type AppRoute = {
  name: string;
  path: string;
};

export const Navigation: React.FC = () => {
  return (
    <header className="fixed flex h-12 w-full flex-row items-center justify-between gap-2 border-b border-zinc-300 bg-zinc-100 px-2 dark:border-zinc-700 dark:bg-zinc-900">
      <Link href={"/"}>
        <h2>PDP Project</h2>
      </Link>
      <div className="hidden lg:flex">
        {appRoutes.map(({ path, name }) => (
          <NavigationLink key={path} path={path} name={name} />
        ))}
      </div>
      <div className="hidden gap-2 lg:flex">
        <AuthButton />
        <ThemeToggle />
      </div>
      <div className="ml-auto flex gap-2 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-end justify-end gap-2">
            {appRoutes.map(({ path, name }) => (
              <NavigationLink key={path} path={path} name={name} />
            ))}
            <AuthButton />
            <ThemeToggle />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const NavigationLink: React.FC<{ path: string; name: string }> = ({
  path,
  name,
}) => {
  const pathname = usePathname();

  const active = name === "Home" ? pathname === "/" : pathname.includes(path);

  return (
    <Link href={path}>
      <li
        className={`text-back flex h-12 min-w-fit items-center justify-center border-y-2 border-transparent  px-2 text-center font-bold dark:text-zinc-200 ${
          active && "border-b-orange-500"
        }`}
      >
        {name}
      </li>
    </Link>
  );
};

const appRoutes: AppRoute[] = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/auth",
    name: "NextAuth SSR",
  },
  {
    path: "/quiz",
    name: "Quiz D'n'D",
  },
];
