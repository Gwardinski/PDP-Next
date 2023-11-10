import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div>
      <h2>PDP Test Project</h2>

      <p>Next with NextAuth</p>
      <Link
        href="https://www.youtube.com/watch?v=md65iBX5Gxg"
        className="underline"
      >
        NextAuth on App Router 📹
      </Link>
    </div>
  );
}
