import {
  DataContainer,
  DescriptionContainer,
  PageLayout,
  PageTitle,
} from "@/app/components/page-layout";
import { getServerSession } from "next-auth";

export default async function RSCPage() {
  const session = await getServerSession();

  return (
    <PageLayout>
      <PageTitle>React Server Component</PageTitle>

      <DescriptionContainer>
        <p>This page uses RSC so has already loaded.</p>
        <p>
          Returns user data using the <code>getServerSession()</code> method
          from <code>next-auth</code>
        </p>
      </DescriptionContainer>

      <DataContainer>
        <p>Data:</p>
        {session?.user?.name ? (
          <h4>{session?.user?.name}</h4>
        ) : (
          <h4>Not logged in</h4>
        )}
      </DataContainer>
    </PageLayout>
  );
}
