import { HTMLAttributes } from "react";

export const PageLayout: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <section className="flex flex-col gap-4 pt-4 h-full" {...props} />
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
) => <div className="flex flex-col h-32 w-full gap-2" {...props} />;

export const DataContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    className="px-4 py-8 border h-32 border-zinc-500 justify-center items-center rounded-lg w-80"
    {...props}
  />
);
