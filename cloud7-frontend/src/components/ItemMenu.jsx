export default function ItemMenu({
                                     onInfo,
                                     onDownload,
                                     onPrimaryAction,
                                     primaryActionLabel = 'Delete',
                                     onClose
                                 }) {
    return (
        <div
            className="
        absolute top-8 right-2
        bg-white
        border border-gray-200
        rounded-lg
        shadow-xl
        text-sm
        z-50
        w-40
      "
            onMouseLeave={onClose}
        >
            {onInfo && (
                <MenuItem label="Info" onClick={onInfo} />
            )}

            {onDownload && (
                <MenuItem label="Download" onClick={onDownload} />
            )}

            {onPrimaryAction && (
                <MenuItem
                    label={primaryActionLabel}
                    className={
                        primaryActionLabel === 'Delete'
                            ? 'text-red-600'
                            : 'text-blue-600'
                    }
                    onClick={onPrimaryAction}
                />
            )}
        </div>
    );
}

function MenuItem({ label, onClick, className = '' }) {
    return (
        <div
            onClick={onClick}
            className={`
        px-4 py-2
        cursor-pointer
        hover:bg-gray-100
        ${className}
      `}
        >
            {label}
        </div>
    );
}
