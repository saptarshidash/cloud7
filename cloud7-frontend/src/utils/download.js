export async function downloadFile(url, filename) {
    const res = await fetch(url, {
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error('Download failed');
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(blobUrl);
}
