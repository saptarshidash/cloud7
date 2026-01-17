import { useState } from 'react';

import plusIcon from '../assets/plus.svg';
import uploadIcon from '../assets/upload.svg';
import folderAddIcon from '../assets/folder-add.svg';

export default function FabMenu({ onUpload, onCreateFolder }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Action buttons */}
            {open && (
                <div className="flex flex-col items-end gap-3 mb-3">
                    <FabAction
                        icon={uploadIcon}
                        label="Upload file"
                        onClick={() => {
                            onUpload();
                            setOpen(false);
                        }}
                    />

                    <FabAction
                        icon={folderAddIcon}
                        label="New folder"
                        onClick={() => {
                            onCreateFolder();
                            setOpen(false);
                        }}
                    />
                </div>
            )}

            {/* Main FAB */}
            <button
                onClick={() => setOpen(o => !o)}
                className="
          w-14 h-14
          rounded-full
          bg-white
          shadow-lg
          border border-gray-200
          flex items-center justify-center
          hover:shadow-xl
          transition
        "
                aria-label="Create"
            >
                <img
                    src={plusIcon}
                    className={`
            w-6 h-6
            transition-transform
            ${open ? 'rotate-45' : ''}
          `}
                />
            </button>
        </div>
    );
}

/* ---------- Sub Action ---------- */

function FabAction({ icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="
        flex items-center gap-3
        bg-white
        border border-gray-200
        rounded-full
        px-4 py-2
        shadow-md
        hover:shadow-lg
        transition
      "
        >
            <img src={icon} className="w-5 h-5" />
            <span className="text-sm text-gray-700">{label}</span>
        </button>
    );
}
