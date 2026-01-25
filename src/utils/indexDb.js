export async function saveMediaToIndexedDB(key, file) 
{
    const db = await openDB();
    const tx = db.transaction("media", "readwrite");
    const store = tx.objectStore("media");
    return new Promise((resolve, reject) => {
        const req = store.put(file, key);
        req.onsuccess = () => {
            db.close();
            resolve();
        };
        req.onerror = () => {
            db.close();
            reject(req.error);
        };
    });
}

export async function getMediaFromIndexedDB(key) 
{
    const db = await openDB();
    const tx = db.transaction("media", "readonly");
    const store = tx.objectStore("media");
    return new Promise((resolve, reject) => {
        const req = store.get(key);
        req.onsuccess = () => {
            db.close();
            resolve(req.result);
        };
        req.onerror = () => {
            db.close();
            reject(req.error);
        };
    });
}

function openDB() 
{
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("StoryMediaDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("media")) {
                db.createObjectStore("media");
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
