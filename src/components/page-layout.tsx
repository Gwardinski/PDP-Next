import { HTMLAttributes } from "react";

export const PageLayout: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <section className="flex h-full flex-col gap-4 pt-4" {...props} />
);

export const PageHeader: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => <header className="" {...props} />;

export const PageTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h1
    className="bg-gradient-to-b from-zinc-700 to-zinc-900 bg-clip-text text-4xl font-extrabold tracking-wider text-transparent dark:from-zinc-100 dark:to-zinc-400"
    {...props}
  />
);

export const DescriptionContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div className="flex h-32 w-full flex-col gap-2" {...props} />;

export const DataContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    className="h-32 w-80 items-center justify-center rounded-lg border border-zinc-500 px-4 py-8"
    {...props}
  />
);
