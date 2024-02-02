import { CodeSnippet } from "@/components/DocText";
import {
  DataContainer,
  PageDescription,
  PageNestedHeader,
  PageNestedLayout,
  PageTitle,
} from "@/components/page-layout";
import { getServerSession } from "next-auth";

export default async function RSCPage() {
  const session = await getServerSession();

  return (
    <PageNestedLayout>
      <PageNestedHeader>
        <PageTitle>React Server Component (RSC)</PageTitle>
        <PageDescription>
          <p>This page uses RSC so has already loaded.</p>
          <p>
            Returns user data using the{" "}
            <CodeSnippet>getServerSession()</CodeSnippet> method from{" "}
            <CodeSnippet>next-auth</CodeSnippet>
          </p>
        </PageDescription>
      </PageNestedHeader>

      <DataContainer>
        <p>Data:</p>
        {session?.user?.name ? (
          <h4>{session?.user?.name}</h4>
        ) : (
          <h4>Not logged in</h4>
        )}
      </DataContainer>
    </PageNestedLayout>
  );
}
