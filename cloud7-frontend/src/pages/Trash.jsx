import { useEffect, useState, useCallback } from 'react';
import ItemMenu from '../components/ItemMenu';
import { BRANDING } from '../config/branding';
import {
    fetchTrash,
    restoreFile,
    restoreFolder
} from '../api/client';
import trashEmptyIcon from '../assets/trash-empty.svg';
import folderIcon from '../assets/folder.svg';
import fileIcon from '../assets/file.svg';
import moreIcon from '../assets/more-blue-filled.svg';

export default function Trash({ user }) {
    const { userId } = user;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuItem, setMenuItem] = useState(null); // { type, id }

    const loadTrash = useCallback(async () => {
        setLoading(true);

        const data = await fetchTrash(userId);

        const merged = [
            ...data.folders.map(f => ({ ...f, _type: 'folder' })),
            ...data.files.map(f => ({ ...f, _type: 'file' }))
        ];

        setItems(merged);
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        loadTrash();
    }, [userId, loadTrash]);

    if (loading) {
        return <p className="p-8 text-gray-500"></p>;
    }

    return (
        <div className="min-h-screen p-8 bg-white text-gray-800">


            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <img
                        src={trashEmptyIcon}
                        alt="Empty trash"
                        className="w-[520px] mb-6"
                    />
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">
                            {BRANDING.trash.empty.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {BRANDING.trash.empty.subtitle}
                        </p>
                    </div>

                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
                    {items.map(item => (
                        <div
                            key={`${item._type}-${item.id}`}
                            className="
                relative group
                w-[160px] h-[140px]
                bg-gray-50
                border border-gray-300
                rounded-xl
                flex flex-col items-center justify-between
                p-3
                shadow-[0_1px_2px_rgba(0,0,0,0.06)]
                hover:shadow-[0_4px_10px_rgba(0,0,0,0.12)]
                transition
              "
                        >
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <img
                                    src={item._type === 'folder' ? folderIcon : fileIcon}
                                    className="w-10 h-10 mb-2"
                                />
                                <p
                                    className="
                    text-[13px] text-gray-800
                    text-center leading-snug
                    line-clamp-2 break-words
                  "
                                >
                                    {item.name}
                                </p>
                            </div>

                            {/* three dots */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuItem({ type: item._type, id: item.id });
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                            >
                                <img
                                    src={moreIcon}
                                    className="w-5 h-5 opacity-70 hover:opacity-100"
                                />
                            </button>

                            {/* menu */}
                            {menuItem?.type === item._type &&
                                menuItem?.id === item.id && (
                                    <ItemMenu
                                        primaryActionLabel="Restore"
                                        onPrimaryAction={async () => {
                                            if (item._type === 'file') {
                                                await restoreFile(item.id);
                                            } else {
                                                await restoreFolder(item.id);
                                            }
                                            setMenuItem(null);
                                            loadTrash();
                                        }}
                                        onClose={() => setMenuItem(null)}
                                    />
                                )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
