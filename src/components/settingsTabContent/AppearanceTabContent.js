import React from "react";
import Accordion from "../Accordion";

const GRADIENT_PRESETS = [
    { name: "Midnight", from: "#0f172a", to: "#020617" },
    { name: "Lavender", from: "#a18cd1", to: "#fbc2eb" },
    { name: "Sunset", from: "#f6d365", to: "#fda085" },
];

export function AppearanceTabContent({ appearance, setAppearance }) {
    const updateAppearance = (key, value) => {
        setAppearance((prev) => ({ ...prev, [key]: value }));
    };

    const ColorInput = ({ label, value, onChange }) => (
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono opacity-50">
                    {value}
                </span>
                <input
                    type="color"
                    value={value || "#000000"}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                />
            </div>
        </div>
    );

    return (
        <div className="text-white/80 h-full overflow-y-auto pb-20 custom-scrollbar">
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
      `}</style>

            <Accordion
                title="Global Background"
                defaultOpen={true}
                className="mb-4"
            >
                <ColorInput
                    label="Gradient Start"
                    value={appearance?.bg_from || "#0f172a"}
                    onChange={(v) => updateAppearance("bg_from", v)}
                />
                <ColorInput
                    label="Gradient End"
                    value={appearance?.bg_to || "#020617"}
                    onChange={(v) => updateAppearance("bg_to", v)}
                />
                <div className="grid grid-cols-3 gap-2 mt-3">
                    {GRADIENT_PRESETS.map((p) => (
                        <div
                            key={p.name}
                            onClick={() => {
                                updateAppearance("bg_from", p.from);
                                updateAppearance("bg_to", p.to);
                            }}
                            className="h-8 rounded cursor-pointer border border-white/10 hover:scale-105 transition"
                            style={{
                                background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
                            }}
                            title={p.name}
                        />
                    ))}
                </div>
            </Accordion>

            <Accordion title="Choice Buttons" className="mb-4">
                <h4 className="text-xs uppercase font-bold text-white/40 mb-2">
                    Normal State
                </h4>
                <ColorInput
                    label="From"
                    value={appearance?.option_from || "#ffffff"}
                    onChange={(v) => updateAppearance("option_from", v)}
                />
                <ColorInput
                    label="To"
                    value={appearance?.option_to || "#eeeeee"}
                    onChange={(v) => updateAppearance("option_to", v)}
                />

                <h4 className="text-xs uppercase font-bold text-white/40 mb-2 mt-4">
                    Hover State
                </h4>
                <ColorInput
                    label="From"
                    value={appearance?.hovered_option_from || "#ED8836"}
                    onChange={(v) => updateAppearance("hovered_option_from", v)}
                />
                <ColorInput
                    label="To"
                    value={appearance?.hovered_option_to || "#FB923C"}
                    onChange={(v) => updateAppearance("hovered_option_to", v)}
                />
            </Accordion>
        </div>
    );
}
