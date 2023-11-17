"use client";

import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { LinkFormType, linksFormRequest } from "./_form-server";

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
      className="flex flex-col gap-4 max-w-md justify-center items-center"
    >
      <input
        type="text"
        placeholder="www.example.com"
        className="w-full text-black h-10 text-lg rounded-md px-2"
        {...register("link", { required: true })}
      />
      <button
        disabled={isPending}
        type="submit"
        className="border rounded-md h-10 w-40 text-lg hover:bg-neutral-800 active:bg-neutral-700"
      >
        Shorten!
      </button>
    </form>
  );
};
