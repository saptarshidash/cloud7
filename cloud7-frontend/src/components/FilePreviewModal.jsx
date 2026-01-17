export default function FilePreviewModal({ file, onClose }) {
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name);

    const previewUrl = `/files/${file.id}/preview`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            style={{ backdropFilter: 'none' }}   // IMPORTANT
        >
            <div
                className="bg-white rounded-xl shadow-2xl"
                style={{
                    width: isPdf ? '80vw' : 'auto',
                    height: isPdf ? '80vh' : 'auto',
                    maxWidth: '90vw',
                    maxHeight: '90vh'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-medium truncate">
            {file.name}
          </span>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>

                {/* Content */}
                <div
                    style={{
                        width: '100%',
                        height: isPdf ? 'calc(80vh - 48px)' : 'auto',
                        overflow: 'auto',
                        background: '#f5f5f5'
                    }}
                >
                    {/* IMAGE */}
                    {isImage && (
                        <img
                            src={previewUrl}
                            alt={file.name}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                display: 'block',
                                margin: 'auto'
                            }}
                        />
                    )}

                    {/* PDF */}
                    {isPdf && (
                        <iframe
                            src={previewUrl}
                            title={file.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                        />
                    )}

                    {!isPdf && !isImage && (
                        <div className="p-8 text-center text-gray-600">
                            Preview not available
                            <br />
                            <a href={previewUrl} download className="text-blue-600 underline">
                                Download
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
