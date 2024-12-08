"use server";

import { promises as fs } from "node:fs";
import Link from "next/link";
import { ModeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { CopyButton } from "~/components/ui/copy-button";
import { BasicForm } from "./BasicForm";
import { DialogForm } from "./DialogForm";
import { Feed } from "./Feed";

export default async function Home() {
  const dialogFile = await fs.readFile(
    `${process.cwd()}/src/app/DialogForm.tsx`,
    "utf8",
  );
  const basicFile = await fs.readFile(
    `${process.cwd()}/src/app/BasicForm.tsx`,
    "utf8",
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b bg-neutral-50 dark:bg-neutral-900">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="container flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="pt-12 font-extrabold text-5xl">Full Stack Forms</h1>
        <h3 className="w-96 font-normal text-lg">
          Starter code for a basic controlled forms to quickly copy and paste
          into your project. Assumes you are starting with a t3 app using
          drizzle-orm.
        </h3>
        <div className="flex flex-row space-x-4">
          <Button asChild variant={"outline"}>
            <Link
              href="https://61d.org/docs/Bonus/fullstack-forms"
              target="_blank"
            >
              View Full Instructions
            </Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link
              href="https://github.com/aidansunbury/fullstack-forms"
              target="_blank"
            >
              View Repo
            </Link>
          </Button>
        </div>

        <div className="flex flex-row space-x-2 py-4">
          <div className="flex flex-col space-y-4">
            <CopyButton text={basicFile}>Copy Basic Form File</CopyButton>
            <Button asChild variant={"outline"}>
              <Link
                href="https://github.com/aidansunbury/fullstack-forms/blob/main/src/app/BasicForm.tsx"
                target="_blank"
              >
                View Basic Form Code
              </Link>
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            <CopyButton text={dialogFile}>Copy Dialog Form File</CopyButton>

            <Button asChild variant={"outline"}>
              <Link
                href="https://github.com/aidansunbury/fullstack-forms/blob/main/src/app/DialogForm.tsx"
                target="_blank"
              >
                View Dialog Form Code
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-96 space-y-8 py-4">
        <div>
          <h2 className="font-bold text-3xl">Dialog Form</h2>
          <DialogForm />
        </div>
        <div>
          <h2 className="font-bold text-3xl">Basic Form</h2>
          <BasicForm />
        </div>
        <div>
          <h2 className="font-bold text-3xl">Recent Posts</h2>
          <Feed />
        </div>
      </div>
    </main>
  );
}
