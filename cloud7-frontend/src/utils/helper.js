export function formatDate(value) {
    if (!value) return '-';

    const millis =
        value < 10_000_000_000
            ? value * 1000
            : value;

    const date = new Date(millis);

    if (isNaN(date.getTime()) || date.getFullYear() < 2000) {
        return '-';
    }

    return date.toLocaleString();
}



export function formatFileSize(bytes) {
    console.log(bytes)
    if (bytes == null || isNaN(bytes)) return '-';
    if (bytes === 0) return '0 KB';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);

    return `${value.toFixed(value < 10 ? 1 : 0)} ${sizes[i]}`;
}



