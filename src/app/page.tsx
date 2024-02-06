import { GithubLink, DocumentationLink } from "@/components/DocText";
import { YoutubeVideo, YoutubeVideoGrid } from "@/components/Youtube";
import {
  PageAccordionDescription,
  PageHeader,
  PageHeading,
  PageLayout,
  PageTitle,
} from "@/components/page-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID_1 = process.env.YOUTUBE_PLAYLIST_ID_1;
const PLAYLIST_ID_2 = process.env.YOUTUBE_PLAYLIST_ID_2;
const YOUTUBE_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

async function getYoutubePlaylist(id: string): Promise<{
  videos: YoutubeVideo[];
}> {
  try {
    const res = await fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=50&playlistId=${id}&key=${KEY}`,
    );
    const data = await res.json();
    const videos: YoutubeVideo[] =
      data?.items.map((item: YoutubeVideo) => {
        return item;
      }) ?? [];
    return { videos };
  } catch {
    console.log("Failed to fetch youtube playlist: ", id);
    return { videos: [] };
  }
}

export default async function Home() {
  const { videos: playlist1 } = await getYoutubePlaylist(PLAYLIST_ID_1 ?? "");
  const { videos: playlist2 } = await getYoutubePlaylist(PLAYLIST_ID_2 ?? "");

  return (
    <PageLayout>
      <PageHeader>
        <PageTitle>PDP Playground</PageTitle>
        <PageAccordionDescription>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="gap-4">
                A playground to work through various tutorials without having to
                setup individual projects.
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  href="https://github.com/Gwardinski/PDP"
                  text="Source Code"
                />
                <h2 className="text-lg">Base TechStack</h2>
                <DocumentationLink
                  href="https://nextjs.org/docs/app/building-your-application/routing"
                  text="Framework - Next 14 w/ App Router"
                />
                <DocumentationLink
                  href="https://vercel.com/"
                  text="Deployment - Vercel"
                />
                <DocumentationLink
                  href="https://tailwindcss.com"
                  text="CSS - Tailwind"
                />
                <DocumentationLink
                  href="https://ui.shadcn.com/"
                  text="UI - shadcn/ui"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageAccordionDescription>
      </PageHeader>

      <PageHeading>Tutorials</PageHeading>
      <p>
        {
          "Interesting things I've added to playlists and may or may not get around to looking into 👀"
        }
      </p>
      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">Stuff to Code</TabsTrigger>
          <TabsTrigger value="2">Stuff to Watch</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <YoutubeVideoGrid videos={playlist1} />
        </TabsContent>
        <TabsContent value="2">
          <YoutubeVideoGrid videos={playlist2} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
