"use client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const roundCreateSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
});

export type RoundCreate = z.infer<typeof roundCreateSchema>;

type CreateRoundModalProps = {
  onCreateRound: (values: RoundCreate) => void;
};

export const CreateRoundModal: React.FC<CreateRoundModalProps> = ({
  onCreateRound,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<RoundCreate>({
    resolver: zodResolver(roundCreateSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: RoundCreate) => {
    form.reset();
    setOpen(false);
    onCreateRound(values);
  };

  const onOpenChange = () => {
    setOpen((o) => !o);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary">Create New Round</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Round</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Round Title</FormLabel>
                  <FormControl>
                    <Input placeholder="General Knowledge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="primary" type="submit" className="w-full">
              Create Round
            </Button>
          </form>
        </Form>

        <DialogFooter className="-mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
