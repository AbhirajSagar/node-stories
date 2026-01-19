import Accordion from "../Accordion";

export function GeneralTabContent({
    name,
    description,
    setName,
    setDescription,
}) {
    return (
        <div className="text-white/80 space-y-4">
            <Accordion title="Story Metadata" defaultOpen={true}>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-white/50 block mb-1">
                            Story Title
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 rounded bg-deep-space-blue text-white/90 focus:ring-1 focus:ring-tiger-orange outline-none"
                            placeholder="My Awesome Story"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-white/50 block mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 h-24 rounded bg-deep-space-blue text-white/90 focus:ring-1 focus:ring-tiger-orange outline-none resize-none"
                            placeholder="Brief summary..."
                        />
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
