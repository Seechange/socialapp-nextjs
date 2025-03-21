import { Loader } from 'lucide-react'


function loading() {
    return (
        <div className="flex h-screen justify-center items-center ">
            <Loader className="w-7 h-7 animate-spin" />
        </div>
    )
}

export default loading