import {
  DataContainer,
  DescriptionContainer,
  PageLayout,
  PageTitle,
} from "@/components/page-layout";
import { headers } from "next/headers";

export default async function RSCAPICallPage() {
  const resp = await fetch("http://localhost:3000/api/whoAmI", {
    method: "GET",
    headers: headers(),
  }).then((res) => res.json());

  return (
    <PageLayout>
      <PageTitle>React Server Component - API Call</PageTitle>

      <DescriptionContainer>
        <p>This page uses RSC so has already loaded.</p>
        <p>
          Returns user data via a <code>fetch()</code> request to a Next API
          route
        </p>
        <p>Notice no flash as the data has already been pre-loaded</p>
      </DescriptionContainer>

      <DataContainer>
        <h4>Data:</h4>
        {resp?.name}
      </DataContainer>
    </PageLayout>
  );
}
