import { AppRoute } from "@/components/Navigation";
import { NavigationSub } from "@/components/NavigationSub";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationSub routes={AuthRoutes} />
      {children}
    </>
  );
}

const AuthRoutes: AppRoute[] = [
  {
    path: "/auth/rsc",
    name: "RSC",
  },
  {
    path: "/auth/rsc-protected",
    name: "RSC - Protected",
  },
  {
    path: "/auth/rsc-server-action",
    name: "RSC - Server Action",
  },
  {
    path: "/auth/rsc-api-call",
    name: "RSC - API Call",
  },
  {
    path: "/auth/client-api-call",
    name: "Client API Call",
  },
];
