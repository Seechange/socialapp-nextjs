"use client"
import { Loader2Icon } from 'lucide-react'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { toggleFollow } from '@/action/user.action'

function FollowButton({ userId, type }: { userId: string, type: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const handleFollow = async () => {
        setIsLoading(true)
        try {
            const res = await toggleFollow(userId);
            if (res?.typeTest === "FOLOW") {
                return toast.success("User unfollowed successfully");
            } else {
                toast.success("User folowed successfully")
            }
        } catch (error) {
            toast.error("Error following user");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Button
            size={"sm"}
            variant={"secondary"}
            onClick={handleFollow}
            disabled={isLoading}
            className="w-20"
        >
            {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : `${type}`}
        </Button>
    )
}


export default FollowButton
