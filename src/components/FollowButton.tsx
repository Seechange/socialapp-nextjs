"use client"
import { Loader2Icon } from 'lucide-react'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { toggleFollow } from '@/action/user.action'

function FollowButton({ userId }: { userId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState("")
    const fetchButton = async () => {
        const res = await toggleFollow(userId);
        setStatus(res?.typeTest || "")
    }

    const handleFollow = async () => {
        setIsLoading(true)
        try {
            const res = await toggleFollow(userId);
            if (res?.typeTest === "FOLOW") {
                setStatus("FOLOW")
                return toast.success("User unfollowed successfully");
            } else {
                setStatus("UNFOLOW")
                toast.success("User folowed successfully")
            }
        } catch (error) {
            toast.error("Error following user");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchButton()
    }, [])

    return (
        <Button
            size={"sm"}
            variant={"secondary"}
            onClick={handleFollow}
            disabled={isLoading}
            className="w-20"
        >
            {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : `${status}`}
        </Button>
    )
}


export default FollowButton
