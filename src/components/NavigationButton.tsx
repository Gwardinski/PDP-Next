"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export const NavigationLink: React.FC<{ path: string; name: string }> = ({
  path,
  name,
}) => {
  const pathname = usePathname();

  // const active = pathname.includes(path);
  const active = false;

  return (
    <Link href={path}>
      <li
        className={
          active
            ? "h-12 flex justify-center items-center font-bold text-back dark:text-zinc-200 px-4 text-lg border-b border-b-orange-500"
            : "h-12 flex justify-center items-center font-bold text-back dark:text-zinc-200 px-4 text-lg"
        }
      >
        {name}
      </li>
    </Link>
  );
};
