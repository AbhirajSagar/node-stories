"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faPlay, faPause, faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";

const GradientContext = createContext(undefined);
const SlidesContext = createContext(undefined);

export default function PlayerPage()
{
    const [storyData, setStoryData] = useState(null);
    const params = useParams(); // Keep for structure, though we use localStorage
    const router = useRouter();

    useEffect(() => 
    {
        // For the tool version, we primarily use "preview" mode from localStorage
        // OR the user could theoretically upload a file here too, but simpler to read storage.
        const cached = localStorage.getItem("azuned_preview");
        if(cached) setStoryData(JSON.parse(cached));
    }, []);

    if(!storyData) return <Loading/>;

    const { slides, appearance, timing } = storyData;
    const { bg_from, bg_to, hovered_option_from, hovered_option_to, option_from, option_to } = appearance || {};
    
    // Fallbacks
    const bgGradient = `linear-gradient(135deg, ${bg_from || '#000'}, ${bg_to || '#333'})`;
    const choiceBtnGradient = `linear-gradient(135deg, ${option_from || '#fff'}, ${option_to || '#eee'})`;
    const choiceBtnHoveredGradient = `linear-gradient(135deg, ${hovered_option_from || 'orange'}, ${hovered_option_to || 'red'})`;

    return (
        <GradientContext.Provider value={{ bgGradient, choiceBtnGradient, choiceBtnHoveredGradient }}>
            <SlidesContext.Provider value={{ slides, curSlide: slides[0], delay: (timing?.delay || 0) * 1000 }}>
                <StoryRunner initialSlide={slides[0]} />
            </SlidesContext.Provider>
        </GradientContext.Provider>
    );
}

function Loading()
{
    return <div className="w-full h-screen bg-dark-blue-black flex justify-center items-center text-white/50">Loading Preview...</div>;
}

function StoryRunner({ initialSlide })
{
    const { slides } = useContext(SlidesContext);
    const { bgGradient } = useContext(GradientContext);
    const [curSlide, setCurSlide] = useState(initialSlide);

    function ChangeSlide(targetId)
    {
        const next = slides.find(s => s.id === targetId);
        if(next) setCurSlide(next);
    }

    if(!curSlide) return <div className="text-white">End of Story</div>;

    const props = { curSlide, onChangeSlide: ChangeSlide };

    return (
        <div className="w-full h-screen relative overflow-hidden" style={{ background: bgGradient }}>
            {curSlide.type === 'normal' && <NormalSlide {...props} />}
            {curSlide.type === 'image' && <MediaSlide {...props} type="image" />}
            {curSlide.type === 'video' && <MediaSlide {...props} type="video" />}
            {curSlide.type === 'audio' && <AudioSlide {...props} />}
        </div>
    );
}

// Reusable Components for Slides

function ChoicesList({ choices, onChangeSlide })
{
    const { delay } = useContext(SlidesContext);
    const [visible, setVisible] = useState(false);
    
    useEffect(() => 
    {
        setVisible(false);
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [choices, delay]);

    if (!visible) return null;

    return (
        <div className="absolute w-full p-6 bottom-0 flex flex-col gap-3 justify-end items-center pb-12 bg-gradient-to-t from-black/80 to-transparent pt-24">
            {choices.map((c, i) => (
                <ChoiceButton key={i} text={c.content} onClick={() => onChangeSlide(c.connection)} />
            ))}
        </div>
    );
}

function ChoiceButton({ text, onClick })
{
    const { choiceBtnGradient, choiceBtnHoveredGradient } = useContext(GradientContext);
    const [hover, setHover] = useState(false);

    return (
        <button 
            onClick={onClick} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
            className="w-full max-w-md p-3 rounded-lg font-medium text-dark-blue-black shadow-lg transform active:scale-95 transition-all"
            style={{ background: hover ? choiceBtnHoveredGradient : choiceBtnGradient }}
        >
            {text}
        </button>
    );
}

function NormalSlide({ curSlide, onChangeSlide })
{
    return (
        <div className="w-full h-full flex flex-col justify-center items-center max-w-[56.25vh] mx-auto outline outline-white/5 relative">
            <h2 className="px-6 text-white text-3xl font-light text-center leading-relaxed drop-shadow-md">{curSlide.data.text}</h2>
            <ChoicesList choices={curSlide.data.choices} onChangeSlide={onChangeSlide} />
        </div>
    );
}

function MediaSlide({ curSlide, onChangeSlide, type })
{
    return (
        <div className="w-full h-full relative bg-black">
             {/* Background Blur */}
            {type === 'image' && <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50" style={{ backgroundImage: `url('${curSlide.data.key}')` }}></div>}
            
            <div className="relative w-full h-full max-w-[56.25vh] mx-auto bg-black flex flex-col">
                {type === 'image' ? (
                    <img src={curSlide.data.key} className="w-full h-full object-cover" alt="Story" />
                ) : (
                    <video src={curSlide.data.key} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                )}
                
                {curSlide.data.text && (
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 px-6 text-center z-10">
                         <span className="bg-black/40 backdrop-blur-md text-white p-2 rounded text-xl">{curSlide.data.text}</span>
                    </div>
                )}

                <ChoicesList choices={curSlide.data.choices} onChangeSlide={onChangeSlide} />
            </div>
        </div>
    );
}

function AudioSlide({ curSlide, onChangeSlide })
{
    // Simplified audio player that auto-plays
    return (
        <div className="w-full h-full flex flex-col justify-center items-center max-w-[56.25vh] mx-auto outline outline-white/5 relative">
            <audio src={curSlide.data.key} autoPlay loop />
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center animate-pulse mb-8">
                <FontAwesomeIcon icon={faVolumeHigh} className="text-4xl text-white/70" />
            </div>
            <h2 className="px-6 text-white text-3xl font-light text-center leading-relaxed drop-shadow-md">{curSlide.data.text}</h2>
            <ChoicesList choices={curSlide.data.choices} onChangeSlide={onChangeSlide} />
        </div>
    );
}