import { helloWorld } from "../server/db";
import { LinkForm } from "./_form-client";

export default async function LinkPage() {
  const hello = await helloWorld();
  console.log(hello);

  return (
    <section className="flex flex-col gap-8 p-4">
      <header>
        <h2>Shorten Your Url</h2>
        <p>Paste your url into the form and hit submit</p>
      </header>

      <LinkForm />
    </section>
  );
}

// export const runtime = "edge";
// Does not work with next-auth (yet)
