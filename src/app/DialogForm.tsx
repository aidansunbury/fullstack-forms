"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useBeforeunload } from "react-beforeunload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MultipleSelector,
  type Option,
} from "@/components/ui/multiple-selector";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/trpc/react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { safeInsertSchema } from "@/lib/safeInsertSchema";
import { categories, posts } from "@/server/db/schema"; //* Replace me with your db table

export function DialogForm() {
  const [isOpen, setOpen] = useState<boolean>(false);

  const formValidator = safeInsertSchema(posts).extend({
    name: z.string().min(1),
    tags: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .array()
      .transform((val) => val.map((v) => v.value)),
  });

  // TODO: Replace me with your db table
  type FormType = z.infer<typeof formValidator>;

  //TODO: Replace me with your default values
  const defaultValues: FormType = {
    name: "",
    category: "" as FormType["category"],
    notes: "",
    tags: [],
  };

  const { toast } = useToast();
  const form = useForm<FormType>({
    defaultValues,
    resolver: zodResolver(formValidator),
  });
  const { control, handleSubmit, formState } = form;
  const utils = api.useUtils();
  const { mutate, isPending } = api.post.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Form Submitted",
        description: (
          <div className="w-80">
            <h1>Returned:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        ),
      });
      form.reset(defaultValues);
      setOpen(false);
      utils.post.list.invalidate(); // TOD0: Replace me with your invalidation
    },
    onError: (error) => {
      toast({
        title: error.data?.code ?? "Error",
        description: error.message,
      });
    },
  });
  useBeforeunload(formState.isDirty ? () => "Unsaved changes" : undefined);

  const onValidationSuccess: SubmitHandler<FormType> = async (data) => {
    mutate(data);
  };

  const onValidationError: SubmitErrorHandler<FormType> = (errors) => {
    console.log(errors);
  };

  const OPTIONS: Option[] = [
    { label: "React", value: "react" },
    { label: "Remix", value: "remix" },
    { label: "Vite", value: "vite" },
    { label: "Vue", value: "vue" },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset(defaultValues);
      }}
    >
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => {
          if (formState.isDirty) {
            e.preventDefault();
            toast({
              title: "Unsaved Changes",
            });
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Dialog Field</DialogTitle>
          <DialogDescription>
            This dialog handles all of the nice quality of life features you
            would expect in a dialog that is focussing the users attention to a
            form.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onValidationSuccess, onValidationError)}
              className="space-y-2"
            >
              {/* Input */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional={false}>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Basic text input" {...field} />
                    </FormControl>
                    <FormDescription>A required text input</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Select */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional={false}>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.enumValues.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      A required single select input
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional Input */}
              <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      {/* @ts-ignore */}
                      <Input placeholder="Basic text input" {...field} />
                    </FormControl>
                    <FormDescription>Optional Text Input</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Multiple Selector */}
              <FormField
                control={control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        value={field.value as unknown as Option[]}
                        onChange={field.onChange}
                        defaultOptions={OPTIONS}
                        placeholder="Select frameworks you like..."
                        emptyIndicator={
                          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
                            No results found.
                          </p>
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      A controlled multi-selector component
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex flex-row justify-between">
                <Button
                  type="button"
                  onClick={() => form.reset(defaultValues)}
                  variant={"destructive"}
                >
                  Reset
                </Button>
                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      form.reset(defaultValues);
                    }}
                    variant={"ghost"}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    loading={isPending}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
