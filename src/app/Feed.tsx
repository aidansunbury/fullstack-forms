"use client";
import { Badge } from "@/components/ui/badge";
import { api } from "~/trpc/react";

export function Feed() {
  const { data } = api.post.list.useQuery();
  if (!data) {
    return "Loading...";
  }

  return (
    <div className="w-80">
      {data?.map((post) => (
        <div key={post.id} className="flex flex-row justify-between border-b">
          <div>
            <h2 className="text-lg">{post.name}</h2>
            <p>Category: {post.category}</p>
            {post.notes && <p>Notes: {post.notes}</p>}
            <div className="flex flex-row">
              {post.tags.length > 0 && <p>Tags: </p>}
              {post.tags.map((tag) => (
                <Badge key={tag} className="mr-2" variant={"outline"}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <p>{new Date(post.createdAt * 1000).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
