"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faImage } from "@fortawesome/free-solid-svg-icons";

export default function PublishPage({ storyData })
{
    const story = storyData?.story;
    const genres = storyData?.genres || [];

    const [name, setName] = useState(story?.name || "");
    const [description, setDescription] = useState(story?.description || "");
    const [genre, setGenre] = useState(story?.genre || "");
    const [thumbnail, setThumbnail] = useState(story?.thumbnailUrl || null);

    const handleImageUpload = (e) =>
    {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setThumbnail(url);
    };

    return (
        <div className="w-full min-h-screen bg-dark-blue-black flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-shadow-grey p-6 rounded-xl shadow-xl border border-white/10 text-white flex flex-col gap-5">
                
                <h1 className="text-xl font-semibold">Publish Story</h1>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/70">Thumbnail</label>
                    <ImageUploadContainer
                        imageUrl={thumbnail}
                        onImageUpload={handleImageUpload}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/70">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-deep-space-blue rounded p-2 text-sm font-light focus:outline-none focus:ring-1 focus:ring-tiger-orange"
                        placeholder="Story name..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/70">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-deep-space-blue rounded p-2 text-sm font-light h-24 resize-none focus:outline-none focus:ring-1 focus:ring-tiger-orange"
                        placeholder="Short description..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/70">Genre</label>
                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="bg-deep-space-blue rounded p-2 text-sm font-light focus:outline-none focus:ring-1 focus:ring-tiger-orange"
                    >
                        {genres.map((g) => (
                            <option key={g.genreid} value={g.genreid}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="mt-2 bg-tiger-orange hover:opacity-90 transition rounded-lg py-2 text-sm font-medium">
                    Publish
                </button>
            </div>
        </div>
    );
}

function ImageUploadPlaceholder() 
{
    return (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
            <FontAwesomeIcon icon={faImage} className="text-2xl mb-2" />
            <span className="text-xs">Upload Image</span>
        </div>
    );
}

function ImagePreview({ imageUrl }) 
{
    return (
        <img
            src={imageUrl}
            alt="Thumbnail"
            className="w-full h-full object-cover"
        />
    );
}

function ImageUploadOverlay({ isVisible }) 
{
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-white" />
        </div>
    );
}

function ImageUploadContainer({ imageUrl, onImageUpload }) 
{
    return (
        <div className="relative w-full h-36 bg-deep-space-blue rounded-lg border border-dashed border-white/20 hover:border-tiger-orange transition-colors overflow-hidden group">
            {imageUrl ? <ImagePreview imageUrl={imageUrl} /> : <ImageUploadPlaceholder />}
            <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload image"
            />
            <ImageUploadOverlay isVisible={!!imageUrl} />
        </div>
    );
}