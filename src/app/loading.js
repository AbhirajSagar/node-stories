import { faEllipsis, faHourglass1, faHourglass2, faHourglass3 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loader()
{
    return(
        <div className="w-screen h-screen bg-dark-blue-black flex justify-center items-center flex-col">
            <FontAwesomeIcon icon={faEllipsis} className="w-16 h-16 text-tiger-orange animate-pulse" />
        </div>
    );
}
