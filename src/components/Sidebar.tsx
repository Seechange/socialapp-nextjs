import { currentUser } from "@clerk/nextjs/server"
import SidebarNoLogin from "./SidebarNoLogin"
import { getUserByClerkId } from "@/action/user.action"
import { Card, CardContent } from "./ui/card"
import Link from "next/link"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { LinkIcon, MapPinIcon } from "lucide-react"


async function Sidebar() {
    const user = await currentUser()
    if (!user) return <SidebarNoLogin />
    const userLogin = await getUserByClerkId(user.id)
    if (!userLogin) return null

    return (
        <div className="sticky top-20">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <Link
                            href={`/profile/${userLogin.username}`}
                            className="flex flex-col items-center justify-center"
                        >
                            <Avatar className="w-20 h-20 border-2 ">
                                <AvatarImage src={userLogin.image || "/avatar.png"} />
                            </Avatar>

                            <div className="mt-4 space-y-1">
                                <h3 className="font-semibold">{userLogin.name}</h3>
                                <p className="text-sm text-muted-foreground">{userLogin.username}</p>
                            </div>
                        </Link>

                        {userLogin.bio && <p className="mt-3 text-sm text-muted-foreground">{userLogin.bio}</p>}

                        <div className="w-full">
                            <Separator className="my-4" />
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{userLogin._count.following}</p>
                                    <p className="text-xs text-muted-foreground">Following</p>
                                </div>
                                <Separator orientation="vertical" />
                                <div>
                                    <p className="font-medium">{userLogin._count.followers}</p>
                                    <p className="text-xs text-muted-foreground">Followers</p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                        </div>

                        <div className="w-full space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                                <MapPinIcon className="w-4 h-4 mr-2" />
                                {userLogin.location || "No location"}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                                {userLogin.website ? (
                                    <a href={`${userLogin.website}`} className="hover:underline truncate" target="_blank">
                                        {userLogin.website}
                                    </a>
                                ) : (
                                    "No website"
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Sidebar