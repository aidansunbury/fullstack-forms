"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { safeInsertSchema } from "@/lib/safeInsertSchema";
import { categories, posts } from "@/server/db/schema"; //* Replace me with your db table

export function BasicForm() {
  const formValidator = safeInsertSchema(posts).extend({
    name: z.string().min(1),
  }); //* Replace me with your db table
  type FormType = z.infer<typeof formValidator>;
  const defaultValues: FormType = {
    //* Replace me with your default values
    name: "",
    category: "" as FormType["category"],
    notes: "",
  };

  const { toast } = useToast();
  const form = useForm<FormType>({
    defaultValues,
    resolver: zodResolver(formValidator),
  });
  const { control, handleSubmit } = form;
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
      utils.post.list.invalidate(); //* Replace me with your invalidation
    },
    onError: (error) => {
      toast({
        title: `${error.data?.code}`,
        description: error.message,
      });
    },
  });

  const onValidationSuccess: SubmitHandler<FormType> = async (data) => {
    mutate(data);
  };

  const onValidationError: SubmitErrorHandler<FormType> = (errors) => {
    console.log(errors);
  };

  return (
    <div className="w-80">
      <Form {...form}>
        <form onSubmit={handleSubmit(onValidationSuccess, onValidationError)}>
          {/* Input */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel optional={false}>Text Input</FormLabel>
                <FormControl>
                  <Input placeholder="Basic text input" {...field} />
                </FormControl>
                <FormDescription>You may change this later</FormDescription>
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
                <FormLabel optional={false}>Post category</FormLabel>
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
                  You can manage email addresses in your
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Basic text input" {...field} />
                </FormControl>
                <FormDescription>This field is optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-row justify-between">
            <Button
              type="button"
              onClick={() => form.reset(defaultValues)}
              variant={"destructive"}
            >
              Reset
            </Button>

            <Button type="submit" disabled={isPending}>
              Create Expense
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
