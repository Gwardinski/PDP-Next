import {
  CodeSnippet,
  GithubLink,
  DocumentationLink,
  VideoLink,
  FunctionalText,
  NonFunctionalText,
  RefreshText,
  BugText,
} from "@/components/DocText";
import {
  PageAccordionDescription,
  PageDescription,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/page-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>PDP Project</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                A playground to work through various tutorials without having to
                setup individual projects.
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  href="https://github.com/Gwardinski/PDP"
                  text="Source Code"
                />
                <h2 className="text-lg">Base TechStack</h2>
                <DocumentationLink
                  href="https://nextjs.org/docs/app/building-your-application/routing"
                  text="Framework - Next 14 w/ App Router"
                />
                <DocumentationLink
                  href="https://vercel.com/"
                  text="Deployment - Vercel"
                />
                <DocumentationLink
                  href="https://tailwindcss.com"
                  text="CSS - Tailwind"
                />
                <DocumentationLink
                  href="https://ui.shadcn.com/"
                  text="UI - shadcn/ui"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
      </PageHeader>
    </PageLayout>
  );
}
