"use server";
import { useAuth } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma"

export async function syncUser() {
    //check user clerk
    const { userId } = await auth()
    const user = await currentUser()
    if (!userId || !user) {
        return
    }

    const userExist = await prisma.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (userExist) return userExist

    const dbUser = await prisma.user.create({
        data: {
            clerkId: userId,
            name: `${user.firstName || ""} ${user.lastName || ""}`,
            username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
            email: user.emailAddresses[0].emailAddress,
            image: user.imageUrl,
        },
    })

    return dbUser

}

export async function getUserByClerkId(clerkId: string) {
    const user = await prisma.user.findUnique({
        where: {
            clerkId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true
                }
            }
        }
    })
    return user
}

export async function getUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return undefined;

    const user = await getUserByClerkId(clerkId);

    if (!user) throw new Error("User not found");

    return user.id;
}