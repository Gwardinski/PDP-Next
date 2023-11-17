"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { NavigationLink } from "./NavigationButton";

export type AppRoute = {
  name: string;
  path: string;
};

export const Navigation: React.FC<{ routes: AppRoute[] }> = ({ routes }) => {
  return (
    <ul className="border-b w-fit border-neutral-700 flex h-12 items-center">
      {routes.map(({ path, name }) => (
        <NavigationLink key={path} path={path} name={name} />
      ))}
    </ul>
  );
};
