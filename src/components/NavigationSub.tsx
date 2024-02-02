"use client";

import { usePathname } from "next/navigation";
import { AppRoute } from "./Navigation";
import Link from "next/link";

export const NavigationSub: React.FC<{ routes: AppRoute[] }> = ({ routes }) => {
  return (
    <nav className="no-scrollbar flex gap-8 overflow-x-auto overflow-y-hidden rounded-md border border-zinc-300  px-2 dark:border-zinc-700">
      {routes.map(({ path, name }) => (
        <NavigationSubLink key={path} path={path} name={name} />
      ))}
    </nav>
  );
};

const NavigationSubLink: React.FC<{ path: string; name: string }> = ({
  path,
  name,
}) => {
  const pathname = usePathname();

  const active = pathname.split("/")[2] === path.split("/")[2];

  return (
    <Link href={path}>
      <div
        className={`flex h-12 w-fit min-w-fit items-center justify-center text-nowrap border-y-2 border-transparent px-2 text-center font-bold dark:text-zinc-200 ${
          active && "border-b-orange-500"
        }`}
      >
        {name}
      </div>
    </Link>
  );
};
