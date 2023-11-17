"use client";

import {
  DataContainer,
  DescriptionContainer,
  PageLayout,
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
    <PageLayout>
      <PageTitle>Client Component - API Call</PageTitle>

      <DescriptionContainer>
        <p>
          This page uses <code>{'"use client"'}</code>
        </p>
        <p>
          Returns user data via a <code>fetch()</code> request to a Next API
          route. Fetch request is wrapped with <code>useEffect</code> and the
          data is stored with <code>useState</code>
        </p>
        <p className="italic">Notice the flash as the data loads in</p>
      </DescriptionContainer>

      <DataContainer>
        <h4>Data:</h4>
        {name}
      </DataContainer>
    </PageLayout>
  );
}
