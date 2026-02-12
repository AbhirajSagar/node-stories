import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Error({err})
{
    return (
        <div className="w-screen h-screen flex-col bg-dark-blue-black flex justify-center items-center">
            <h2 className="w-full text-white/50 text-center text-2xl font-medium">{err?.message || 'Internal Server Error'}</h2>
        </div>
    )
}