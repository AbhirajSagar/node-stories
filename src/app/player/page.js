"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import extractFlowData from "@/app/utils/flowExtractor";
import { getMediaFromIndexedDB } from "@/app/utils/indexDb";

const PLAYER_STORAGE_KEY = "player_story_data";

export default function PlayerPage() {
    const router = useRouter();
    const [gameData, setGameData] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(null);

    useEffect(() => {
        const raw = sessionStorage.getItem(PLAYER_STORAGE_KEY);
        if (!raw) {
            router.push("/editor"); // Redirect if no data
            return;
        }
        const json = JSON.parse(raw);
        const data = extractFlowData(json, 0.1);
        setGameData(data);

        // Find Start Node (First slide in array or logic to find root)
        if (data.slides.length > 0) {
            // Optimization: Create a map for faster lookup
            setCurrentSlide(data.slides[0]);
        }
    }, [router]);

    const handleChoice = (targetId) => {
        if (!targetId) return; // End of path
        const next = gameData.slides.find((s) => s.id === targetId);
        if (next) setCurrentSlide(next);
    };

    if (!currentSlide || !gameData)
        return (
            <div className="bg-black h-screen w-screen text-white flex items-center justify-center">
                Loading...
            </div>
        );

    return (
        <div className="w-screen h-screen overflow-hidden bg-black relative">
            <SlideRenderer
                slide={currentSlide}
                appearance={gameData.appearance}
                timing={gameData.timing}
                onNavigate={handleChoice}
            />
        </div>
    );
}

function SlideRenderer({ slide, appearance, timing, onNavigate }) {
    const [mediaUrl, setMediaUrl] = useState(null);

    // Background Styles
    const bgStyle = {
        background: `linear-gradient(135deg, ${appearance.bg_from || "#0f172a"}, ${appearance.bg_to || "#020617"})`,
    };

    // Load Media
    useEffect(() => {
        let active = true;
        setMediaUrl(null); // Reset prev media immediately

        if (
            (slide.type === "image" || slide.type === "video") &&
            slide.data.key
        ) {
            getMediaFromIndexedDB(slide.data.key).then((blob) => {
                if (active && blob) setMediaUrl(URL.createObjectURL(blob));
            });
        }
        return () => {
            active = false;
            if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        };
    }, [slide.id, slide.type, slide.data.key]);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative"
            style={bgStyle}
        >
            {/* Media Layer */}
            {slide.type !== "normal" && (
                <div className="absolute inset-0 z-0">
                    {slide.type === "image" && mediaUrl && (
                        <img
                            src={mediaUrl}
                            className="w-full h-full object-cover opacity-60"
                            alt=""
                        />
                    )}
                    {slide.type === "video" && mediaUrl && (
                        <video
                            src={mediaUrl}
                            className="w-full h-full object-cover opacity-60"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    )}
                    {/* Overlay gradient to make text readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
            )}

            {/* Content Layer */}
            <div className="z-10 relative w-full max-w-4xl px-6 flex flex-col items-center text-center pb-20">
                {/* Main Text */}
                <div className="mb-8 p-6 rounded-xl backdrop-blur-sm bg-black/20 border border-white/5 shadow-2xl">
                    <p className="text-xl md:text-3xl font-light leading-relaxed text-white drop-shadow-md">
                        {slide.data.text || "..."}
                    </p>
                </div>

                {/* Choices */}
                <ChoiceGroup
                    choices={slide.data.choices}
                    onNavigate={onNavigate}
                    appearance={appearance}
                    delay={timing.delay}
                />
            </div>
        </div>
    );
}

function ChoiceGroup({ choices, onNavigate, appearance, delay }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(false);
        const timer = setTimeout(() => setVisible(true), (delay || 0) * 1000);
        return () => clearTimeout(timer);
    }, [choices, delay]);

    if (!choices || choices.length === 0) return null;

    const btnStyle = (isHover) => ({
        background: `linear-gradient(90deg, 
        ${isHover ? appearance.hovered_option_from || "#ED8836" : appearance.option_from || "#ffffff"}, 
        ${isHover ? appearance.hovered_option_to || "#FB923C" : appearance.option_to || "#e2e2e2"}
    )`,
        color: isHover ? "#fff" : "#000",
    });

    return (
        <div
            className={`flex flex-wrap justify-center gap-4 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
        >
            {choices.map(
                (c, i) =>
                    c.content && (
                        <ChoiceButton
                            key={i}
                            text={c.content}
                            onClick={() => onNavigate(c.connection)}
                            getStyle={btnStyle}
                        />
                    )
            )}
        </div>
    );
}

function ChoiceButton({ text, onClick, getStyle }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={getStyle(hover)}
            className="px-6 py-3 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
        >
            {text}
        </button>
    );
}
