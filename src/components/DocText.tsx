import {
  ExternalLink,
  Youtube,
  Github,
  CheckCircle,
  Wrench,
  CircleOff,
  RefreshCw,
  Bug,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";

export const DocumentationLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    href={href}
    className="text-md flex w-fit items-center justify-center gap-4 underline"
  >
    <ExternalLink className="text-blue-600 dark:text-blue-500" /> {text}
  </Link>
);

export const VideoLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    href={href}
    className="text-md flex w-fit items-center justify-center gap-4 underline"
  >
    <Youtube className="text-red-600 dark:text-red-500" /> {text}
  </Link>
);

export const GithubLink: React.FC<{
  href: string;
  text: string;
}> = ({ href, text }) => (
  <Link
    href={href}
    className="text-md flex w-fit items-center justify-center gap-4 underline"
  >
    <Github /> {text}
  </Link>
);

export const FunctionalText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <CheckCircle className="text-green-600 dark:text-green-500" /> {text}
  </div>
);

export const NonFunctionalText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <Wrench className="text-orange-600 dark:text-orange-500" /> {text}
  </div>
);

export const BugText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4 font-bold">
    <Bug className="text-red-600 dark:text-red-500" /> {text}
  </div>
);

export const RefreshText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <RefreshCw /> {text}
  </div>
);

export const TodoText: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="text-md flex w-fit items-center justify-center gap-4">
    <ListTodo className="text-yellow-600 dark:text-yellow-500" />{" "}
    <b className="-mr-2">TODO:</b>
    {text}
  </div>
);

export const CodeSnippet: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <code
    className="rounded-md bg-zinc-400 px-1 py-0.5 dark:bg-zinc-700"
    {...props}
  />
);
