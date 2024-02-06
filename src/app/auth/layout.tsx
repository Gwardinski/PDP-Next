import {
  DocumentationLink,
  VideoLink,
  GithubLink,
  FunctionalText,
  BugText,
} from "@/components/DocText";
import { AppRoute } from "@/components/Navigation";
import { NavigationSub } from "@/components/NavigationSub";
import {
  PageLayout,
  PageHeader,
  PageTitle,
  PageAccordionDescription,
} from "@/components/page-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import path from "path";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>NextAuth SSR</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                NextAuth with Server Side Rendering
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  text="Source Code"
                  href="https://github.com/Gwardinski/PDP/tree/main/src/app/auth"
                />
                <DocumentationLink
                  href="https://next-auth.js.org/"
                  text="NextAuth Docs"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=md65iBX5Gxg"
                  text="Youtube Tutorial"
                />
                <FunctionalText text="Each route gets user data" />
                <BugText text="'RSC - API Call' current goosed on Prod. Only works locally" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
        <NavigationSub routes={AuthRoutes} />
      </PageHeader>

      {children}
    </PageLayout>
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
