import { PageHeader, PageLayout, PageTitle } from "@/components/page-layout";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>PDP Test Project</PageTitle>
      </PageHeader>
    </PageLayout>
  );
}
