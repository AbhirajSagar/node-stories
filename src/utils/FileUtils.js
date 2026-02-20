import JSZip from "jszip";
import { GetStandaloneHtml } from "./PlayerTemplate";

function GetDbName(projectId) 
{
    return `azuned-project-${projectId}`;
}

function GetDb(projectId)
{
    return new Promise((resolve, reject) =>
    {
        const request = indexedDB.open(GetDbName(projectId), 1);
        request.onupgradeneeded = () =>
        {
            const db = request.result;
            if (!db.objectStoreNames.contains("media"))
            {
                db.createObjectStore("media", { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function SaveFileToProjectDB(projectId, mediaId, file)
{
    const db = await GetDb(projectId);
    return new Promise((resolve, reject) =>
    {
        const tx = db.transaction("media", "readwrite");
        const store = tx.objectStore("media");
        // Store the file blob with the ID
        store.put({ id: mediaId, file: file });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

export async function LoadFileFromProjectDB(projectId, mediaId)
{
    const db = await GetDb(projectId);
    return new Promise((resolve, reject) =>
    {
        const tx = db.transaction("media", "readonly");
        const store = tx.objectStore("media");
        const req = store.get(mediaId);

        req.onsuccess = () =>
        {
            if (!req.result) return resolve(null);
            // Create a temporary Blob URL
            resolve(URL.createObjectURL(req.result.file));
        };
        req.onerror = () => reject(req.error);
    });
}

export async function DeleteProjectDB(projectId)
{
    return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(GetDbName(projectId));
        req.onsuccess = () => resolve();
        req.onerror = () => reject();
    });
}

export function GetProjectsList()
{
    const raw = localStorage.getItem("azuned_projects_meta");
    return raw ? JSON.parse(raw) : [];
}

export function SaveProjectsList(list)
{
    localStorage.setItem("azuned_projects_meta", JSON.stringify(list));
}

export function CreateProject(name)
{
    const id = crypto.randomUUID();
    const newProject = { 
        id, 
        name, 
        lastModified: Date.now() 
    };
    
    const list = GetProjectsList();
    list.push(newProject);
    SaveProjectsList(list);

    // Init empty data for project
    localStorage.setItem(`azuned_data_${id}`, JSON.stringify(null)); 
    return id;
}

export function DeleteProject(id)
{
    const list = GetProjectsList().filter(p => p.id !== id);
    SaveProjectsList(list);
    localStorage.removeItem(`azuned_data_${id}`);
    DeleteProjectDB(id); // Clean up media
}

// --- Export / Import Logic ---

export async function ExportProjectToZip(projectId, storyData)
{
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets");
    const db = await GetDb(projectId);

    // 1. Get all media from DB
    const mediaItems = await new Promise((resolve) => {
        const tx = db.transaction("media", "readonly");
        const store = tx.objectStore("media");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
    });

    // 2. Clone story data to modify paths for export
    const exportData = JSON.parse(JSON.stringify(storyData));
    
    // Map of internal DB ID -> Export Filename
    const idToFilename = {};

    for (const item of mediaItems) 
    {
        const ext = item.file.type.split('/')[1] || 'bin';
        const fileName = `${crypto.randomUUID()}.${ext}`;
        assetsFolder.file(fileName, item.file);
        idToFilename[item.id] = `assets/${fileName}`;
    }

    // 3. Update slides to use asset paths instead of DB IDs
    exportData.slides.forEach(slide => {
        if(slide.data.key && idToFilename[slide.id]) // Note: We use NodeID as MediaID in this architecture
        {
            slide.data.key = idToFilename[slide.id];
        }
    });

    // 4. Add Files to Zip
    zip.file("story.json", JSON.stringify(exportData, null, 2));
    zip.file("index.html", GetStandaloneHtml(storyData.name));

    // 5. Generate and Download
    const blob = await zip.generateAsync({ type: "blob" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${storyData.name.replace(/\s+/g, '_')}_Package.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}

export async function ImportProjectFromZip(file)
{
    const zip = await JSZip.loadAsync(file);
    
    // 1. Read Story JSON
    const jsonFile = zip.file("story.json");
    if(!jsonFile) throw new Error("Invalid Project: Missing story.json");
    
    const jsonStr = await jsonFile.async("string");
    const storyData = JSON.parse(jsonStr);

    // 2. Create new Project ID
    const projectId = CreateProject(storyData.name + " (Imported)");
    
    // 3. Process Assets
    const slides = storyData.slides;
    for(const slide of slides)
    {
        // Check if slide references an asset (e.g., "assets/uuid.jpg")
        if(slide.data.key && slide.data.key.startsWith("assets/"))
        {
            const assetPath = slide.data.key;
            const fileInZip = zip.file(assetPath);
            
            if(fileInZip)
            {
                const blob = await fileInZip.async("blob");
                // Save to new DB using the Node ID as key
                await SaveFileToProjectDB(projectId, slide.id, blob);
                
                // Update the key in JSON back to the ID for internal use
                // (Though strictly speaking, internal logic just needs to know it HAS a key, 
                // the NodeID is the lookup key in DB).
                slide.data.key = "true"; // Just a flag, node loads by its own ID
            }
        }
    }

    // 4. Save JSON to LocalStorage
    localStorage.setItem(`azuned_data_${projectId}`, JSON.stringify(storyData));
    
    return projectId;
}