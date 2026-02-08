import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPaintBrush, faSlidersH, faTimes } from "@fortawesome/free-solid-svg-icons";
import { GeneralTabContent } from "./settingsTabContent/GeneralTabContent";
import { AppearanceTabContent } from "./settingsTabContent/AppearanceTabContent";
import { AdvancedTabContent } from "./settingsTabContent/AdvancedTabContent";

const TABS = [
    {
        id: "general",
        label: "General",
        icon: faGear,
        Component: GeneralTabContent,
    },
    {
        id: "appearance",
        label: "Design",
        icon: faPaintBrush,
        Component: AppearanceTabContent,
    },
    {
        id: "advanced",
        label: "Advanced",
        icon: faSlidersH,
        Component: AdvancedTabContent,
    },
];

export function Settings(props) {
    const [activeTabId, setActiveTabId] = useState("general");
    const ActiveComponent = TABS.find((t) => t.id === activeTabId)?.Component;

    return (
        <div className="absolute top-0 right-0 h-full w-80 bg-shadow-grey/95 backdrop-blur shadow-2xl z-50 flex flex-col border-l border-white/10">
            {/* Header / Tabs */}
            <div className="flex items-center p-2 gap-1 border-b border-white/10 bg-black/20">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`flex-1 flex flex-col items-center py-2 px-1 rounded transition-all text-xs ${
                            activeTabId === tab.id
                                ? "bg-deep-space-blue text-tiger-orange"
                                : "text-white/60 hover:bg-white/5"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={tab.icon}
                            className="mb-1 text-sm"
                        />
                        {tab.label}
                    </button>
                ))}
                <button
                    onClick={() => props.setIsPreviewVisible(false)}
                    className="w-8 h-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 overflow-y-auto">
                {ActiveComponent && <ActiveComponent {...props} />}
            </div>
        </div>
    );
}
