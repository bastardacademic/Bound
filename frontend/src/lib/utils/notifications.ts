// utils/notifications.ts

type Visibility = "public" | "shared" | "private";

interface Post {
  visibility: Visibility;
  authorId: string;
  friends: string[]; // people who are friends with the author
  constellation: string[]; // people in author's relationship constellation
}

export function canNotify(viewerId: string, post: Post): boolean {
  if (post.visibility === "public") return true;
  if (post.visibility === "shared") {
    return post.friends.includes(viewerId) || post.constellation.includes(viewerId);
  }
  return false;
}
