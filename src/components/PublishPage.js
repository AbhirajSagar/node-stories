"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faImage, faPenNib } from "@fortawesome/free-solid-svg-icons";

export default function PublishPage({ storyData }) {
    const router = useRouter();
    const story = storyData?.story || undefined;
    const genres = storyData?.genres || [];

    const [name, setName] = useState(story?.name || "");
    const [description, setDescription] = useState(story?.description || "");
    const [genre, setGenre] = useState(story?.genre || "");
    const [thumbnailUrl, setThumbnailUrl] = useState(story?.thumbnailUrl || null);
    const [thumbnailFile, setThumbnailFile] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    async function handlePublishing()
    {
        setIsLoading(true);
        try
        {
            const formData = new FormData();
            formData.append("storyid", story.storyid);
            formData.append("thumbnail", thumbnailFile);
            formData.append("genre",genre);
            
            const reqOptions = 
            {
                method : "POST",
                body : formData
            }
            const res = await fetch('/api/story/publish', reqOptions);
            const data = await res.json();
            console.log(data);
        }
        catch(err)
        {
            console.log(err)
        }
        finally
        {
            setIsLoading(false);
        }
    }

    function handleImageUpload(e)
    {
        const file = e.target.files?.[0];
        if (!file) return;

        // Force max size of 3MB (3 * 1024 * 1024 bytes)
        if (file.size > 3 * 1024 * 1024) {
            alert("File is too large. Please upload an image smaller than 3MB.");
            return;
        }

        const url = URL.createObjectURL(file);
        setThumbnailUrl(url);
        setThumbnailFile(file);
    };

    if(!isLoading) return <Loading/>

    return (
        <div className="w-full min-h-screen bg-dark-blue-black text-white flex items-center justify-center p-3 sm:p-6 lg:p-12">
            <div className="w-full max-w-6xl bg-shadow-grey rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
                
                {/* Header - Compact on mobile */}
                <div className="px-4 py-3 md:px-6 md:py-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <FontAwesomeIcon icon={faPenNib} className="text-tiger-orange text-sm md:text-base" />
                    <h1 className="text-base md:text-lg font-semibold tracking-wide">Publish Story</h1>
                </div>

                <div className="p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                        
                        {/* Left Column: Image */}
                        <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                            {/* Constrain width on mobile to save vertical space */}
                            <div className="w-40 sm:w-52 lg:w-full lg:sticky lg:top-4">
                                <label className="block text-xs md:text-sm font-medium text-white/70 mb-2 ml-1">
                                    Cover Image
                                </label>
                                <div className="shadow-lg shadow-black/50 rounded-lg">
                                    <ImageUploadContainer
                                        imageUrl={thumbnailUrl}
                                        onImageUpload={handleImageUpload}
                                    />
                                </div>
                                <p className="text-[10px] md:text-xs text-white/40 mt-2 text-center lg:text-left">
                                    Ratio 9:16. Max size 3MB.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Form Data */}
                        <div className="lg:col-span-8 flex flex-col h-full">
                            <div className="space-y-4 md:space-y-6 flex-grow">
                                
                                {/* Name Input */}
                                <div className="group">
                                    <label className="block text-xs md:text-sm font-medium text-white/70 mb-1 md:mb-2 group-focus-within:text-tiger-orange transition-colors">
                                        Story Title
                                    </label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-deep-space-blue border border-white/10 rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base placeholder-white/20 focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-tiger-orange/50 focus:border-tiger-orange transition-all shadow-inner"
                                        placeholder="Enter a captivating title..."
                                    />
                                </div>

                                {/* Genre Select */}
                                <div className="group">
                                    <label className="block text-xs md:text-sm font-medium text-white/70 mb-1 md:mb-2 group-focus-within:text-tiger-orange transition-colors">
                                        Genre
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                            className="w-full bg-deep-space-blue border border-white/10 rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base appearance-none focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-tiger-orange/50 focus:border-tiger-orange transition-all cursor-pointer"
                                        >
                                            <option value="" disabled>Select a genre</option>
                                            {genres.map((g) => (
                                                <option key={g.genreid} value={g.genreid}>
                                                    {g.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 md:px-4 pointer-events-none text-white/50">
                                            <svg className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Input */}
                                <div className="group flex-grow flex flex-col">
                                    <label className="block text-xs md:text-sm font-medium text-white/70 mb-1 md:mb-2 group-focus-within:text-tiger-orange transition-colors">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-deep-space-blue border border-white/10 rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base placeholder-white/20 focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-tiger-orange/50 focus:border-tiger-orange transition-all shadow-inner resize-y min-h-[120px] md:min-h-[160px] lg:min-h-[250px]"
                                        placeholder="What is your story about? Hook your readers..."
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row gap-3 md:gap-4 justify-end items-center">
                                <button 
                                    onClick={() => router.push('/')}
                                    className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-sm md:text-base text-white/60 hover:text-white hover:bg-white/10 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button onClick={handlePublishing} className="w-full sm:w-auto bg-tiger-orange hover:bg-tiger-orange/90 active:scale-95 transition-all duration-200 rounded-lg px-6 py-2 md:px-8 md:py-2.5 text-sm md:text-base text-white font-semibold shadow-lg shadow-tiger-orange/20">
                                    Publish Story
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components

function Loading()
{
    return (
        <div className="w-full min-h-screen bg-dark-blue-black text-white flex items-center justify-center p-3 sm:p-6 lg:p-12">
            <div className="w-full max-w-6xl bg-shadow-grey rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
                
                {/* Header - Compact on mobile */}
                <div className="px-4 py-3 md:px-6 md:py-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <FontAwesomeIcon icon={faPenNib} className="text-tiger-orange text-sm md:text-base" />
                    <h1 className="text-base md:text-lg font-semibold tracking-wide">Publish Story</h1>
                </div>

                <div className="p-4 md:p-8">
                    
                </div>
            </div>
        </div>
    )
}

function ImageUploadContainer({ imageUrl, onImageUpload }) {
    return (
        <div className="relative w-full aspect-[9/16] bg-deep-space-blue rounded-lg border border-dashed border-white/20 hover:border-tiger-orange/50 transition-all duration-300 overflow-hidden group cursor-pointer">
            {imageUrl ? (
                <ImagePreview imageUrl={imageUrl} />
            ) : (
                <ImageUploadPlaceholder />
            )}
            
            <input 
                type="file" 
                accept="image/*" 
                onChange={onImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                aria-label="Upload cover image"
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none z-10 ${imageUrl ? 'opacity-0 group-hover:opacity-100' : 'hidden'}`}>
                <FontAwesomeIcon icon={faCloudUploadAlt} className="text-2xl md:text-3xl text-white mb-2" />
                <span className="text-[10px] md:text-xs font-medium text-white uppercase tracking-wider">Change Cover</span>
            </div>
        </div>
    );
}

function ImageUploadPlaceholder() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-white/30 group-hover:text-tiger-orange transition-colors p-4 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-tiger-orange/10 transition-colors">
                <FontAwesomeIcon icon={faImage} className="text-xl md:text-2xl" />
            </div>
            <span className="text-xs md:text-sm font-medium">Upload Cover</span>
        </div>
    );
}

function ImagePreview({ imageUrl }) {
    return (
        <div className="w-full h-full relative">
            <img 
                src={imageUrl} 
                alt="Story Thumbnail" 
                className="w-full h-full object-cover"
            />
        </div>
    );
}