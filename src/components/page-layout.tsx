import { HTMLAttributes } from "react";

export const PageLayout: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <section className="flex h-full flex-col gap-4 pb-40" {...props} />
);

export const PageHeader: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <header
    className="my-4 flex flex-col gap-4 border-b border-zinc-300 pb-4 dark:border-zinc-700"
    {...props}
  />
);

export const PageTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h1
    className="bg-gradient-to-b from-zinc-700 to-zinc-900 bg-clip-text text-4xl font-extrabold tracking-wider text-transparent dark:from-zinc-100 dark:to-zinc-400"
    {...props}
  />
);

export const PageDescription: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h1
    className="flex w-fit flex-col gap-2 rounded-xl bg-zinc-300 p-4 pt-3 dark:bg-zinc-700"
    {...props}
  />
);

export const DataContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    className="h-32 w-full items-center justify-center rounded-lg border border-zinc-500 px-4 py-8 lg:w-80"
    {...props}
  />
);
