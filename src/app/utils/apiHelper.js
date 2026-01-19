export default async function CustomFetch(url, method = "GET", body = null) {
    const headers = { "Content-Type": "application/json" };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(url, options);
        const text = await res.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        return { status: res.status, data };
    } catch (err) {
        console.error("Fetch error:", err);
        return { status: 500, data: err.message };
    }
}
