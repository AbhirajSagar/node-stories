import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

export default function Accordion({title,children,defaultOpen = false,className = ""})
{
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className={`border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors ${className}`}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between cursor-pointer bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
            >
                <h3 className="text-sm font-semibold text-white/90">{title}</h3>
                <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    className={`text-white/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <div className="px-4 py-4 bg-black/20 border-t border-white/5 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
}
