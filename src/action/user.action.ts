"use server";
import { useAuth } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma"
import { revalidatePath } from "next/cache";

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

export async function getRandomUser() {
    try {
        const userId = await getUserId()
        if (!userId) return []
        const randomUser = await prisma.user.findMany({
            where: {
                AND: [
                    { NOT: { id: userId } },
                    {
                        NOT: {
                            followers: {
                                some: {
                                    followerId: userId,
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
            take: 4,
        })
        return randomUser
    } catch (error) {
        console.log("Error fetching random users", error);
        return [];
    }

}

export async function getRandomUserFlowed() {
    try {
        const userId = await getUserId()
        if (!userId) return []
        const randomUser = await prisma.user.findMany({
            where: {
                AND: [
                    { NOT: { id: userId } },
                    {

                        followers: {
                            some: {
                                followerId: userId,
                            },
                        },

                    },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
            take: 4,
        })
        return randomUser
    } catch (error) {
        console.log("Error fetching random users", error);
        return [];
    }

}

export async function toggleFollow(targetUserId: string) {
    try {
        const userId = await getUserId()
        if (!userId) return
        if (userId === targetUserId) throw new Error("You cannot follow yourself");

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId,
                },
            },
        });

        if (existingFollow) {
            // unfollow
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetUserId,
                    },
                },
            });

            revalidatePath("/");
            return { success: true, typeTest: "FOLOW" };
        } else {
            // follow
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: userId,
                        followingId: targetUserId,
                    },
                }),

                prisma.notification.create({
                    data: {
                        type: "FOLLOW",
                        userId: targetUserId, // user being followed
                        creatorId: userId, // user following
                    },
                }),
            ]);
            revalidatePath("/");
            return { success: true, typeTest: "UNFOLOW" };
        }

    } catch (error) {
        console.log("Error in toggleFollow", error);
        return { success: false, error: "Error toggling follow" };
    }
}