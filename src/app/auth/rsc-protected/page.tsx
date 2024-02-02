import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  DataContainer,
  PageDescription,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/page-layout";

export default async function RSCProtectedPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>React Server Component - Protected!</PageTitle>

        <PageDescription>
          <p>This page uses RSC so has already loaded.</p>
          <p>
            Returns user data using the <code>getServerSession()</code> method
            from <code>next-auth</code>
          </p>
          <p>Protected by a redirect when unauthenticated</p>
        </PageDescription>
      </PageHeader>

      <DataContainer>
        <p>Data:</p>
        {session?.user?.name ? (
          <h4>{session?.user?.name}</h4>
        ) : (
          <h4>This sentence will never be seen</h4>
        )}
      </DataContainer>
    </PageLayout>
  );
}
