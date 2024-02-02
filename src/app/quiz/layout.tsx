import {
  DocumentationLink,
  VideoLink,
  GithubLink,
  FunctionalText,
  BugText,
  NonFunctionalText,
  RefreshText,
  TodoText,
  CodeSnippet,
} from "@/components/DocText";
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

export default function QuizLayout({
  editor,
  library,
}: {
  library: React.ReactNode;
  editor: React.ReactNode;
}) {
  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>{"Quiz 'Trello' Board"}</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                <div className="flex flex-col items-start justify-start gap-2">
                  <p>Interface for editing a Quiz, using DnD Kit & Zustand.</p>
                  <p>
                    Zustand means no <CodeSnippet>useState()</CodeSnippet> means
                    no <CodeSnippet>{'"use client"'}</CodeSnippet>
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  text="Source Code"
                  href="https://github.com/Gwardinski/PDP/tree/main/src/app/quiz"
                />
                <DocumentationLink
                  href="https://www.npmjs.com/package/zustand#typescript-usage"
                  text="Zustand Docs"
                />
                <DocumentationLink
                  href="https://dndkit.com/"
                  text="DnD Kit Docs"
                />
                <VideoLink
                  href="https://www.youtube.com/watch?v=RG-3R6Pu_Ik"
                  text="DnD Kit Youtube Tutorial"
                />
                <FunctionalText text="Adding, Removing, and Ordering all work as expected" />
                <NonFunctionalText
                  text="Search functionality is non-functional and just for example
                    purposes"
                />
                <NonFunctionalText
                  text="Menu functionality - edit, publish delete is non-functional and just for example
                    purposes"
                />
                <RefreshText text="Refresh page to reset data" />
                <BugText text="Can't drag Question into Empty Round" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
      </PageHeader>

      <div className="flex flex-col gap-8 lg:flex-row">
        {editor}
        {library}
      </div>
    </PageLayout>
  );
}
