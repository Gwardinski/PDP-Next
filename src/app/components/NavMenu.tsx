"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const NavMenu: React.FC<{ routes: Route[] }> = ({ routes }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name;

  return (
    <ul className="border-t border-neutral-700 flex">
      {routes.map(({ path, name }) => (
        <RouteLink
          key={path}
          path={path}
          name={name}
          active={pathname === path}
        />
      ))}
    </ul>
  );
};

const RouteLink: React.FC<{ path: string; name: string; active: boolean }> = ({
  path,
  name,
  active,
}) => {
  return (
    <Link href={path}>
      <li
        className={
          active
            ? "border rounded-md px-4 py-2 bg-neutral-500"
            : "border rounded-md px-4 py-2"
        }
      >
        {name}
      </li>
    </Link>
  );
};

type Route = {
  name: string;
  path: string;
};

export const NextAuthRoutes: Route[] = [
  {
    path: "/nextauth/rsc",
    name: "RSC",
  },
  {
    path: "/nextauth/rsc-protected",
    name: "RSC - Protected",
  },
  {
    path: "/nextauth/rsc-server-action",
    name: "RSC - Server Action",
  },
  {
    path: "/nextauth/rsc-api-call",
    name: "RSC - API Call",
  },
  {
    path: "/nextauth/client-api-call",
    name: "Client API Call",
  },
];
