import { getPosts } from "@/action/post.action";
import { getUserId } from "@/action/user.action";
import CreatePost from "@/components/CreatePost";
import ListFolower from "@/components/ListFolower";
import PostCard from "@/components/PostCard";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser()
  const posts = await getPosts()
  const userId = await getUserId()
  if (!userId) return
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6" >
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} userId={userId} />
          ))}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <ListFolower />
      </div>
    </div>
  );
}
