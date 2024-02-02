"use client";

import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { LinkFormType, linksFormRequest } from "./_form-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const LinkForm: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<LinkFormType>();

  const onSubmit = async (form: LinkFormType) => {
    startTransition(() => {
      linksFormRequest(form);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-md flex-col items-center justify-center gap-4"
    >
      <Input
        type="text"
        placeholder="www.example.com"
        className="h-10 w-full rounded-md px-2 text-lg text-black"
        {...register("link", { required: true })}
      />
      <Button variant="outline-primary" disabled={isPending} type="submit">
        Shorten!
      </Button>
    </form>
  );
};
