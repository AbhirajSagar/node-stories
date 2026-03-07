"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { LoadFileFromProjectDB } from "@/utils/FileUtils";

const GradientContext = createContext(undefined);
const SlidesContext = createContext(undefined);

export default function PlayerPage()
{
    const [storyData, setStoryData] = useState(null);

    useEffect(() => 
    {
        const cached = localStorage.getItem("azuned_preview");
        if(cached) setStoryData(JSON.parse(cached));
    }, []);

    if(!storyData) return <Loading/>;

    const { slides, appearance, timing } = storyData;
    const { bg_from, bg_to, hovered_option_from, hovered_option_to, option_from, option_to } = appearance || {};
    
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
    const [mediaUrl, setMediaUrl] = useState(undefined);

    useEffect(() => 
    {
        let activeUrl = null;
        async function load() 
        {
            if (curSlide.data.key && curSlide.data.projectId)
            {
                const url = await LoadFileFromProjectDB(curSlide.data.projectId, curSlide.data.key);
                if (url)
                {
                    activeUrl = url;
                    setMediaUrl(url);
                }
            } 
        }

        load();

        return () => 
        { 
            if(activeUrl) 
                URL.revokeObjectURL(activeUrl); 
        };
        
    }, [curSlide.data.key, curSlide.data.projectId]);

    return (
        <div className="w-full h-full relative bg-black">
             {/* Background Blur */}
            {type === 'image' && <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50" style={{ backgroundImage: `url('${mediaUrl || ''}')` }}></div>}
            
            <div className="relative w-full h-full max-w-[56.25vh] mx-auto bg-black flex flex-col">
                {type === 'image' ? (
                    <img src={mediaUrl} className="w-full h-full object-cover" alt="Story" />
                ) : (
                    <video src={mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
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
    const [mediaUrl, setMediaUrl] = useState(undefined);

    useEffect(() => {
        let activeUrl = null;
        async function load() {
            if (curSlide.data.key && curSlide.data.projectId) {
                if (curSlide.data.key.includes('/') || curSlide.data.key.includes('.')) {
                    setMediaUrl(curSlide.data.key);
                } else {
                    const url = await LoadFileFromProjectDB(curSlide.data.projectId, curSlide.data.key);
                    if (url) {
                        activeUrl = url;
                        setMediaUrl(url);
                    }
                }
            } else if (curSlide.data.key) {
                setMediaUrl(curSlide.data.key); // Fallback
            }
        }
        load();
        return () => { if(activeUrl) URL.revokeObjectURL(activeUrl); };
    }, [curSlide.data.key, curSlide.data.projectId]);

    // Simplified audio player that auto-plays
    return (
        <div className="w-full h-full flex flex-col justify-center items-center max-w-[56.25vh] mx-auto outline outline-white/5 relative">
            <audio src={mediaUrl} autoPlay loop />
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center animate-pulse mb-8">
                <FontAwesomeIcon icon={faVolumeHigh} className="text-4xl text-white/70" />
            </div>
            <h2 className="px-6 text-white text-3xl font-light text-center leading-relaxed drop-shadow-md">{curSlide.data.text}</h2>
            <ChoicesList choices={curSlide.data.choices} onChangeSlide={onChangeSlide} />
        </div>
    );
}