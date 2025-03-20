import CreatePost from "@/components/CreatePost";
import ListFolower from "@/components/ListFolower";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6" >
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <ListFolower />
      </div>
    </div>
  );
}
