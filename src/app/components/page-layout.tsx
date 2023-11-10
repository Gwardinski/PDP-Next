import { HTMLAttributes } from "react";

export const PageLayout: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div className="flex flex-col gap-4 pt-4" {...props} />
);

export const PageTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props
) => (
  <h1
    className="bg-gradient-to-b from-neutral-100 to-neutral-400 bg-clip-text text-4xl font-extrabold tracking-wider text-transparent"
    {...props}
  />
);

export const DescriptionContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props
) => <div className="flex flex-col h-32 w-full gap-2" {...props} />;

export const DataContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (
  props
) => (
  <div
    className="px-4 py-8 border h-32 border-neutral-500 justify-center items-center rounded-lg w-80"
    {...props}
  />
);
