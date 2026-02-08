"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import extractFlowData from "@/utils/flowExtractor";

const PLAYER_STORAGE_KEY = "player_story_data";

export default function PlayerPage()
{
    const router = useRouter();
    const [gameData, setGameData] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(null);

    useEffect(() => 
    {
        const raw = sessionStorage.getItem(PLAYER_STORAGE_KEY);
        if (!raw) 
        {
            router.push("/editor"); 
            return;
        }

        const json = JSON.parse(raw);
        const data = extractFlowData(json, 0.1);
        setGameData(data);

        if (data.slides.length > 0) 
        {
            setCurrentSlide(data.slides[0]);
        }
    }, [router]);

    function handleChoice(targetId)
    {
        if (!targetId) return;
        const next = gameData.slides.find((s) => s.id === targetId);
        if (next) setCurrentSlide(next);
    }

    if (!currentSlide || !gameData)
    {
        return <div className="bg-black h-screen w-screen text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="w-screen h-screen overflow-hidden bg-black relative">
            <SlideRouter 
                slide={currentSlide} 
                appearance={gameData.appearance} 
                timing={gameData.timing} 
                onNavigate={handleChoice} 
            />
        </div>
    );
}

// Routes traffic to the correct layout component based on slide type
function SlideRouter({ slide, appearance, timing, onNavigate })
{
    if (slide.type === "normal")
    {
        return <TextSlideView slide={slide} appearance={appearance} timing={timing} onNavigate={onNavigate} />;
    }
    
    // Both Image and Video share the "Bottom Center" layout logic
    return <MediaSlideView slide={slide} appearance={appearance} timing={timing} onNavigate={onNavigate} />;
}

// Layout: Center Horizontal / Center Vertical
function TextSlideView({ slide, appearance, timing, onNavigate })
{
    const bgStyle = {
        background: `linear-gradient(135deg, ${appearance.bg_from || "#0f172a"}, ${appearance.bg_to || "#020617"})`
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6" style={bgStyle}>
            <div className="max-w-4xl w-full flex flex-col items-center text-center">
                <div className="mb-10 p-8 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
                    <SlideText text={slide.data.text} />
                </div>
                
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

// Layout: Fullscreen Background / Content at Bottom Center
function MediaSlideView({ slide, appearance, timing, onNavigate })
{
    const mediaUrl = slide.data.key;

    return (
        <div className="w-full h-full relative bg-black">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {slide.type === "image" && mediaUrl && (
                    <img src={mediaUrl} className="w-full h-full object-cover" alt="Story Slide" />
                )}
                {slide.type === "video" && mediaUrl && (
                    <video src={mediaUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                )}
            </div>

            {/* Content Layer - Pushed to bottom */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-16 px-6 text-center">
                <div className="max-w-4xl w-full flex flex-col items-center">
                    <div className="mb-8 drop-shadow-lg backdrop-blur-2xl bg-black/10 px-3 rounded outline-1 outline-white">
                        <SlideText text={slide.data.text} />
                    </div>

                    <ChoiceGroup 
                        choices={slide.data.choices} 
                        onNavigate={onNavigate} 
                        appearance={appearance} 
                        delay={timing.delay} 
                    />
                </div>
            </div>
        </div>
    );
}

function SlideText({ text })
{
    return (
        <p className="text-xl md:text-3xl font-bold leading-relaxed text-white">
            {text || "..."}
        </p>
    );
}

function ChoiceGroup({ choices, onNavigate, appearance, delay })
{
    const [visible, setVisible] = useState(false);

    useEffect(() => 
    {
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
        color: isHover ? "#fff" : "#000"
    });

    return (
        <div className={`flex flex-wrap justify-center gap-4 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
            {choices.map((c, i) => c.content && (
                <ChoiceButton 
                    key={i} 
                    text={c.content} 
                    onClick={() => onNavigate(c.connection)} 
                    getStyle={btnStyle} 
                />
            ))}
        </div>
    );
}

function ChoiceButton({ text, onClick, getStyle })
{
    const [hover, setHover] = useState(false);

    return (
        <button 
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={getStyle(hover)}
            className="px-6 py-3 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
        >
            {text}
        </button>
    );
}