'use client';

import { useContext, useState, useRef, useEffect } from "react";
import { createContext } from "react";

import { faPlay, faPause, faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GradientContext = createContext(undefined);
const SlidesContext = createContext(undefined);

export default function PlayerPage({storyJson})
{
    const slides = storyJson.slides;
    const [curSlide, setCurSlide] = useState(slides[0]);
    
    const {bg_from, bg_to, hovered_option_from, hovered_option_to, option_from, option_to} = storyJson.appearance;
    const {delay} = storyJson.timing;
    
    const bgGradient = `linear-gradient(135deg, ${bg_from}, ${bg_to})`
    const choiceBtnGradient = `linear-gradient(135deg, ${option_from}, ${option_to})`
    const choiceBtnHoveredGradient = `linear-gradient(135deg, ${hovered_option_from}, ${hovered_option_to})`

    return (
        <GradientContext.Provider value={{bgGradient, choiceBtnGradient, choiceBtnHoveredGradient}}>
            <SlidesContext.Provider value={{slides, curSlide, setCurSlide, delay : delay * 1000}}>
                <Slide curSlide={curSlide}/>
            </SlidesContext.Provider>
        </GradientContext.Provider>
    )
}

function Slide({curSlide})
{
    if(curSlide.type === 'normal')
        return <NormalSlide/>
    else if(curSlide.type === 'image')
        return <ImageSlide/>
    else if(curSlide.type === 'video')
        return <VideoSlide/>
}

function NormalSlide()
{
    const {bgGradient} = useContext(GradientContext);
    const {slides, curSlide, setCurSlide, delay} = useContext(SlidesContext);
    const [showChoices, setShowChoices] = useState(false);

    useEffect(() => {setTimeout(() => setShowChoices(true), delay)},[])

    function changeSlide(slideId)
    {
        const next = slides.find((s) => s.id === slideId);
        if(next) setCurSlide(next);
    }

    return (
        <div className='w-full h-full' style={{backgroundImage: bgGradient}}>
            <div className="w-full outline relative outline-white/10 flex justify-center items-center max-w-[56.25vh] h-screen max-h-screen aspect-9/16 mx-auto" style={{backgroundImage: bgGradient}}>
                {curSlide.data?.text && <h2 className="px-4 text-white/50 text-2xl font-normal">{curSlide.data.text}</h2>}
                <div className="absolute w-full h-64 p-4 from-gray-400/10 to-transparent bg-linear-0 bottom-0 flex justify-end gap-2 items-center flex-col">
                    {showChoices && curSlide.data.choices.map((choice, idx) => <ChoiceButton onClick={() => changeSlide(choice.connection)} key={idx} text={choice.content}/>) }
                </div>
            </div>
        </div>
    )
}

function ChoiceButton({text, onClick})
{
    const {choiceBtnGradient, choiceBtnHoveredGradient} = useContext(GradientContext);
    const [hovered, setHovered] = useState(false);

    return (
        <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="w-full p-2 rounded-lg h-12 hover:text-white cursor-pointer active:scale-90 transition-transform duration-75" style={{backgroundImage: hovered ? choiceBtnHoveredGradient : choiceBtnGradient}}>
            {text}
        </button>
    );
}

function ImageSlide()
{
    const {slides, curSlide, setCurSlide, delay} = useContext(SlidesContext);
    const [showChoices, setShowChoices] = useState(false);

    useEffect(() => {setTimeout(() => setShowChoices(true), delay)},[])

    function changeSlide(slideId)
    {
        const next = slides.find((s) => s.id === slideId);
        if(next) setCurSlide(next);
    }

    return (
        <div className='w-full h-full relative overflow-hidden bg-center bg-no-repeat bg-cover' style={{backgroundImage: `url('${curSlide.data.key}')`}}>
            <div className='absolute inset-0 bg-no-repeat bg-cover bg-center backdrop-blur-xl brightness-30'></div>
            <div className="w-full outline relative outline-white/10 flex flex-col justify-center items-center max-w-[56.25vh] h-screen max-h-screen aspect-9/16 mx-auto bg-center" style={{backgroundImage: `url('${curSlide.data.key}')`}}>
                <div className="absolute w-full h-64 p-4 from-gray-400/10 to-transparent bg-linear-0 bottom-0 flex justify-end gap-2 items-center flex-col">
                    <h2 className="text-white/70 bg-dark-blue-black/30 backdrop-blur-xs w-full rounded p-2 text-center">{curSlide.data.text}</h2>
                    {showChoices && curSlide.data.choices.map((choice, idx) => <ChoiceButton onClick={() => changeSlide(choice.connection)} key={idx} text={choice.content}/>) }
                </div>
            </div>
        </div>
    )
}

function VideoSlide()
{
    const {slides, curSlide, setCurSlide, delay} = useContext(SlidesContext);
    const [showControls, setShowControls] = useState(false);
    const [paused, setPaused] = useState(false);
    const [muted, setMuted] = useState(true);
    const [showChoices, setShowChoices] = useState(false);
    const videoRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {setTimeout(() => setShowChoices(true), delay)},[])

    function changeSlide(slideId)
    {
        const next = slides.find((s) => s.id === slideId);
        if(next) setCurSlide(next);
    }

    function showTemporaryControls()
    {
        setShowControls(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }

    function togglePlay()
    {
        if(!videoRef.current) return;
        if(videoRef.current.paused)
        {
            videoRef.current.play();
            setPaused(false);
        }
        else
        {
            videoRef.current.pause();
            setPaused(true);
        }
        showTemporaryControls();
    }

    function toggleMute()
    {
        if(!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setMuted(videoRef.current.muted);
        showTemporaryControls();
    }

    return (
        <div className='w-full h-full relative overflow-hidden bg-center bg-no-repeat bg-cover'>
            <video src={curSlide.data.key} muted loop playsInline className="absolute inset-0 w-full h-full object-cover"/>
            <div className='absolute inset-0 backdrop-blur-xl brightness-30'></div>

            <div className="w-full outline relative outline-white/10 flex flex-col justify-center items-center max-w-[56.25vh] h-screen max-h-screen aspect-9/16 mx-auto bg-center">
                
                <video
                    ref={videoRef}
                    src={curSlide.data.key}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onClick={showTemporaryControls}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {showControls && (
                    <>
                        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                            <div className="bg-black/40 backdrop-blur-md rounded-full p-6">
                                <button onClick={togglePlay} className="text-white text-2xl pointer-events-auto">
                                    <FontAwesomeIcon icon={paused ? faPlay : faPause}/>
                                </button>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                            <button onClick={toggleMute} className="text-white text-lg">
                                <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh}/>
                            </button>
                        </div>
                    </>
                )}

                <div className="absolute w-full h-64 p-4 from-gray-400/10 to-transparent bg-linear-0 bottom-0 flex justify-end gap-2 items-center flex-col">
                    <h2 className="text-white/70 bg-dark-blue-black/30 backdrop-blur-xs w-full rounded p-2 text-center">
                        {curSlide.data.text}
                    </h2>
                    {showChoices && curSlide.data.choices.map((choice, idx) => <ChoiceButton onClick={() => changeSlide(choice.connection)} key={idx} text={choice.content}/>)}
                </div>
            </div>
        </div>
    )
}