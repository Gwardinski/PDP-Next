import { getServerSession } from "next-auth";
import WhoAmIButton from "./WhoAmIButton";
import {
  DataContainer,
  PageDescription,
  PageNestedHeader,
  PageNestedLayout,
  PageTitle,
} from "@/components/page-layout";
import { CodeSnippet } from "@/components/DocText";

export default async function RSCServerActionPage() {
  const whoAmI = async (): Promise<string> => {
    "use server";
    const session = await getServerSession();
    return session?.user?.name || "Not Logged In";
  };

  return (
    <PageNestedLayout>
      <PageNestedHeader>
        <PageTitle>RSC - Server Actions</PageTitle>

        <PageDescription>
          <p>This page uses RSC so has already loaded.</p>
          <p>
            Returns user data via a server action that is passed down as an
            onClick method to a child component marked with{" "}
            <CodeSnippet>{'"use client"'}</CodeSnippet>
          </p>
          <p>
            This allows the child to only call the data when required, and then
            store the value using <CodeSnippet>useState</CodeSnippet>
          </p>
        </PageDescription>
      </PageNestedHeader>

      <DataContainer>
        <WhoAmIButton whoAmI={whoAmI} />
      </DataContainer>
    </PageNestedLayout>
  );
}
