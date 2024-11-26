"use server";

import { BasicForm } from "./BasicForm";
import { DialogForm } from "./DialogForm";
import { Feed } from "./Feed";
import { promises as fs } from "node:fs";
import { CopyButton } from "~/components/ui/copy-button";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
          Full Stack Forms
        </h1>
        <p>
          Starter code for a basic controlled forms to quickly copy and paste
          into your project.
        </p>
        <div className="flex flex-row space-x-4">
          <CopyButton text={basicFile}>Copy Basic Form File</CopyButton>
          <CopyButton text={dialogFile}>Copy Dialog Form File</CopyButton>
        </div>
      </div>
      <div className="w-80 space-y-4">
        <div>
          <h2 className="font-bold text-3xl">Dialog Form</h2>
          <DialogForm />
        </div>
        <div>
          <h2 className="font-bold text-3xl">Basic Form</h2>
          <BasicForm />
        </div>

        <h2 className="font-bold text-3xl">Recent Posts</h2>
        <Feed />
      </div>
    </main>
  );
}
