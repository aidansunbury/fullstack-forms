"use client";
import { api } from "~/trpc/react";

export function Feed() {
  const { data } = api.post.list.useQuery();
  return (
    <div className="w-80">
      {data?.map((post) => (
        <div key={post.id} className="border-b">
          <h2>{post.name}</h2>
          <p>{post.category}</p>
          <p>{post.notes}</p>
        </div>
      ))}
    </div>
  );
}
