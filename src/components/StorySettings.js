import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPaintBrush, faSlidersH, faTimes } from "@fortawesome/free-solid-svg-icons";
import { GeneralTabContent } from "@/components/SettingsTabContent/GeneralTabContent";
import { AppearanceTabContent } from "@/components/SettingsTabContent/AppearanceTabContent";
import { AdvancedTabContent } from "@/components/SettingsTabContent/AdvancedTabContent";

const TABS = [
    { id: "general", label: "General", icon: faGear, Component: GeneralTabContent },
    { id: "appearance", label: "Design", icon: faPaintBrush, Component: AppearanceTabContent },
    { id: "advanced", label: "Advanced", icon: faSlidersH, Component: AdvancedTabContent },
];

export function Settings({ setIsPreviewVisible, ...props }) 
{
    const [activeTabId, setActiveTabId] = useState("general");
    const ActiveComponent = TABS.find((t) => t.id === activeTabId)?.Component;

    return (
        <div className="absolute top-0 right-0 h-full bg-shadow-grey/95 backdrop-blur-xl shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 flex flex-col border-l border-white/10 transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h2 className="text-lg font-bold text-white tracking-wide">
                    Configuration
                </h2>
                <button
                    onClick={() => setIsPreviewVisible(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <div className="px-6 py-4">
                <div className="flex p-1 bg-black/30 rounded-lg border border-white/5">
                    {TABS.map((tab) => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-white/10 text-tiger-orange shadow-sm"
                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <FontAwesomeIcon icon={tab.icon} className={isActive ? "text-tiger-orange" : ""} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                <div key={activeTabId} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="mb-4">
                         <h3 className="text-xs uppercase tracking-widest text-white/30 font-bold mb-1">
                            {TABS.find(t => t.id === activeTabId)?.label} Settings
                         </h3>
                         <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>
                    
                    {ActiveComponent && <ActiveComponent {...props} />}
                </div>
            </div>
        </div>
    );
}