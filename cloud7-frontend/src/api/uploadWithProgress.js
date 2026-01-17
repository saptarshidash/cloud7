import { API } from './client';

export function uploadFileWithProgress(
    file,
    folderId,
    userId,
    onProgress
) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const form = new FormData();

        form.append('file', file);
        form.append('userId', userId);
        if (folderId !== null) {
            form.append('folderId', folderId);
        }

        xhr.open('POST', `${API}/files/upload`);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error('Upload failed'));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Upload failed'));
        };

        xhr.send(form);
    });
}
