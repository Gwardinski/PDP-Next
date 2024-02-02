import { CodeSnippet } from "@/components/DocText";
import {
  DataContainer,
  PageDescription,
  PageNestedHeader,
  PageNestedLayout,
  PageTitle,
} from "@/components/page-layout";
import { headers } from "next/headers";

export default async function RSCAPICallPage() {
  const resp = await fetch("http://localhost:3000/api/whoAmI", {
    method: "GET",
    headers: headers(),
  }).then((res) => res.json());

  return (
    <PageNestedLayout>
      <PageNestedHeader>
        <PageTitle>RSC - API Call</PageTitle>

        <PageDescription>
          <p>This page uses RSC so has already loaded.</p>
          <p>
            Returns user data via a <CodeSnippet>fetch()</CodeSnippet> request
            to a Next API route
          </p>
          <p>Notice no flash as the data has already been pre-loaded</p>
        </PageDescription>
      </PageNestedHeader>

      <DataContainer>
        <h4>Data:</h4>
        {resp?.name}
      </DataContainer>
    </PageNestedLayout>
  );
}
