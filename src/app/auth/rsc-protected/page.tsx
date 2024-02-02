import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  DataContainer,
  PageDescription,
  PageHeader,
  PageLayout,
  PageNestedHeader,
  PageNestedLayout,
  PageTitle,
} from "@/components/page-layout";
import { CodeSnippet } from "@/components/DocText";

export default async function RSCProtectedPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <PageNestedLayout>
      <PageNestedHeader>
        <PageTitle>React Server Component - Protected!</PageTitle>

        <PageDescription>
          <p>This page uses RSC so has already loaded.</p>
          <p>
            Returns user data using the{" "}
            <CodeSnippet>getServerSession()</CodeSnippet> method from{" "}
            <CodeSnippet>next-auth</CodeSnippet>
          </p>
          <p>Protected by a redirect when unauthenticated</p>
        </PageDescription>
      </PageNestedHeader>

      <DataContainer>
        <p>Data:</p>
        {session?.user?.name ? (
          <h4>{session?.user?.name}</h4>
        ) : (
          <h4>This sentence will never be seen</h4>
        )}
      </DataContainer>
    </PageNestedLayout>
  );
}
