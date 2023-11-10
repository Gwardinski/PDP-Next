import { getServerSession } from "next-auth";

import WhoAmIButton from "./WhoAmIButton";
import {
  DataContainer,
  DescriptionContainer,
  PageLayout,
  PageTitle,
} from "@/app/components/page-layout";

export default async function RSCServerActionPage() {
  const whoAmI = async (): Promise<string> => {
    "use server";
    const session = await getServerSession();
    return session?.user?.name || "Not Logged In";
  };

  return (
    <PageLayout>
      <PageTitle>React Server Actions</PageTitle>

      <DescriptionContainer>
        <p>This page uses RSC so has already loaded.</p>
        <p>
          Returns user data via a server action that is passed down as an
          onClick method to a child component marked with{" "}
          <code>{'"use client"'}</code>
        </p>
        <p>
          This allows the child to only call the data when required, and then
          store the value using <code>useState</code>
        </p>
      </DescriptionContainer>

      <DataContainer>
        <WhoAmIButton whoAmI={whoAmI} />
      </DataContainer>
    </PageLayout>
  );
}
