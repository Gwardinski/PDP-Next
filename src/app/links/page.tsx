import {
  PageLayout,
  PageHeader,
  PageTitle,
  PageDescription,
} from "@/components/page-layout";
import { helloWorld } from "../server/db";
import { LinkForm } from "./_form-client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function LinkPage() {
  const hello = await helloWorld();
  console.log(hello);

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>URL Shortner</PageTitle>
        <PageDescription>
          <p>WIP NON FUNCTIONAL</p>
          <p>{"'Paste your url into the form and hit submit'"}</p>
          <p>Using Neon & SSR</p>
          <Link
            href="https://neon.tech/"
            className="questions-center flex w-fit gap-2 hover:underline"
          >
            <ExternalLink /> Neon Docs
          </Link>
          <Link
            href="https://www.youtube.com/watch?v=NfVELsEZFsA&list=PL73W7B9EwZMRGjImi0REEne3jqMPRurHI&index=6"
            className="questions-center flex w-fit gap-2 hover:underline"
          >
            <ExternalLink /> Youtube Tutorial
          </Link>
          <p>Abandon this? Cba learning yet another out-the-box backend...</p>
        </PageDescription>
      </PageHeader>
      <LinkForm />
    </PageLayout>
  );
}

// export const runtime = "edge";
// Does not work with next-auth (yet)
