import {
  DataContainer,
  PageDescription,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/page-layout";
import { getServerSession } from "next-auth";

export default async function RSCPage() {
  const session = await getServerSession();

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>React Server Component (RSC)</PageTitle>
        <PageDescription>
          <p>This page uses RSC so has already loaded.</p>
          <p>
            Returns user data using the <code>getServerSession()</code> method
            from <code>next-auth</code>
          </p>
        </PageDescription>
      </PageHeader>

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
