"use client";

import { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ClipboardIcon, CheckIcon } from "lucide-react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
type InstallType = "dependency" | "registry-component";

type InstallBlockProps = {
	enabledPackageManagers?: PackageManager[];
	defaultPackageManager?: PackageManager;
	installType: InstallType;
	installItems: string[];
};

const dependencyPmMapping = {
	npm: "npm install",
	yarn: "yarn add",
	pnpm: "pnpm add",
	bun: "bun add",
};

const registryComponentPmMapping = {
	npm: "npx shadcn@latest add",
	yarn: "npx shadcn@latest add",
	pnpm: "pnpm dlx shadcn@latest add",
	bun: "bunx --bun shadcn@latest add",
};

const getPrefix = (pm: PackageManager, installType: InstallType) => {
	if (installType === "dependency") {
		return dependencyPmMapping[pm];
	}
	return registryComponentPmMapping[pm];
};

export const InstallBlock = ({
	enabledPackageManagers = ["npm", "yarn", "pnpm", "bun"],
	defaultPackageManager = "npm",
	installType,
	installItems,
}: InstallBlockProps) => {
	const [_, copyToClipboard] = useCopyToClipboard();
	const [copied, setCopied] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	}, [copied]);

	const suffix = installItems.join(" ");

	return (
		<div className="relative">
			<pre className="mb-4 mt-6 overflow-x-auto rounded-lg border py-2">
				<code className="relative rounded px-4 font-mono text-sm">
					<span className="line">
						<span style={{ color: "rgb(179, 146, 240)" }}>
							{getPrefix(defaultPackageManager, installType)}
						</span>
						<span style={{ color: "rgb(158, 203, 255)" }}>
							{" "}
							{installItems.join(" ")}
						</span>
					</span>
				</code>
			</pre>

			<div className="absolute right-2 top-2 flex gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className={cn(
								"relative z-10 h-6 w-6 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200",
							)}
						>
							{copied ? (
								<CheckIcon className="h-3 w-3" />
							) : (
								<ClipboardIcon className="h-3 w-3" />
							)}
							<span className="sr-only">Copy</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{enabledPackageManagers.map((pm) => (
							<DropdownMenuItem
								key={pm}
								onClick={() => {
									copyToClipboard(`${getPrefix(pm, installType)} ${suffix}`);
									setCopied(true);
								}}
							>
								{pm}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
