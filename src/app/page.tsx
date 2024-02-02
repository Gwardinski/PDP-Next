import {
  PageDescription,
  PageHeader,
  PageLayout,
  PageTitle,
} from "@/components/page-layout";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>PDP Project</PageTitle>
        <PageDescription>
          <p>
            A playground to work through various tutorials without having to
            setup individual projects.
          </p>
        </PageDescription>
      </PageHeader>
    </PageLayout>
  );
}
