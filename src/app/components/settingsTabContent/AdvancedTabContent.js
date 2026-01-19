import Accordion from "../Accordion";

export function AdvancedTabContent({ timing, setTiming }) {
    return (
        <div className="text-white/80">
            <Accordion title="Playback Settings" defaultOpen={true}>
                <div className="flex items-center justify-between">
                    <label className="text-sm text-white/70">
                        Choice Reveal Delay (sec)
                    </label>
                    <input
                        type="number"
                        value={timing?.delay || 0}
                        onChange={(e) =>
                            setTiming({
                                ...timing,
                                delay: Math.max(
                                    0,
                                    parseFloat(e.target.value) || 0
                                ),
                            })
                        }
                        step={0.5}
                        min={0}
                        max={10}
                        className="w-16 bg-deep-space-blue p-1 rounded text-center focus:ring-1 focus:ring-tiger-orange outline-none"
                    />
                </div>
            </Accordion>
        </div>
    );
}
