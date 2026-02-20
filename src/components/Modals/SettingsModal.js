import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPaintBrush, faSlidersH, faTimes } from "@fortawesome/free-solid-svg-icons";
import { GeneralTabContent } from "@/components/SettingsTabContent/GeneralTabContent";
import { AppearanceTabContent } from "@/components/SettingsTabContent/AppearanceTabContent";
import { AdvancedTabContent } from "@/components/SettingsTabContent/AdvancedTabContent";

const TABS = 
[
    { id: "general", label: "General", icon: faGear, Component: GeneralTabContent },
    { id: "appearance", label: "Design", icon: faPaintBrush, Component: AppearanceTabContent },
    { id: "advanced", label: "Advanced", icon: faSlidersH, Component: AdvancedTabContent },
];

export default function SettingsModal(props)
{
    const [activeTabId, setActiveTabId] = useState("general");
    const ActiveComponent = TABS.find((t) => t.id === activeTabId)?.Component;

    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-shadow-grey border border-white/10 rounded-xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
                
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-white font-semibold text-lg">Story Settings</h2>
                    <button onClick={props.onClose} className="text-white/50 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-48 bg-deep-space-blue/50 border-r border-white/10 p-2 space-y-1">
                        {TABS.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${activeTabId === tab.id ? "bg-tiger-orange text-white" : "text-white/60 hover:bg-white/5"}`}>
                                <FontAwesomeIcon icon={tab.icon} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-dark-blue-black">
                        {ActiveComponent && <ActiveComponent {...props} />}
                    </div>
                </div>
            </div>
        </div>
    );
}