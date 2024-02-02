"use client";

import { CodeSnippet } from "@/components/DocText";
import {
  DataContainer,
  PageDescription,
  PageNestedHeader,
  PageNestedLayout,
  PageTitle,
} from "@/components/page-layout";
import { useState, useEffect } from "react";

export default function ClientAPICallPage() {
  const [name, setName] = useState<string>();

  useEffect(() => {
    fetch("/api/whoAmI")
      .then((res) => res.json())
      .then((data) => setName(data.name));
  }, []);

  return (
    <PageNestedLayout>
      <PageNestedHeader>
        <PageTitle>Client Component - API Call</PageTitle>

        <PageDescription>
          <p>
            This page uses <CodeSnippet>{'"use client"'}</CodeSnippet>
          </p>
          <p>
            Returns user data via a <CodeSnippet>fetch()</CodeSnippet> request
            to a Next API route. Fetch request is wrapped with{" "}
            <CodeSnippet>useEffect</CodeSnippet> and the data is stored with{" "}
            <CodeSnippet>useState</CodeSnippet>
          </p>
          <p className="italic">Notice the flash as the data loads in</p>
        </PageDescription>
      </PageNestedHeader>

      <DataContainer>
        <h4>Data:</h4>
        {name}
      </DataContainer>
    </PageNestedLayout>
  );
}
