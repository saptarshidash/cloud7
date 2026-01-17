import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function NewFolderModal({ open, onClose, onCreate }) {
    const [name, setName] = useState('');

    if (!open) return null;

    function submit() {
        if (!name.trim()) return;
        onCreate(name.trim());
        setName('');
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="
            w-[360px]
            bg-white
            rounded-2xl
            shadow-xl
            p-6
          "
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        New folder
                    </h2>

                    <input
                        autoFocus
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Folder name"
                        className="
              w-full
              p-3
              border border-gray-300
              rounded-lg
              text-gray-900
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              mb-6
            "
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="
                px-4 py-2
                text-sm
                text-gray-600
                hover:bg-gray-100
                rounded-lg
              "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={submit}
                            className="
                px-4 py-2
                text-sm
                bg-[#1a73e8]
                text-white
                rounded-lg
                hover:bg-blue-600
              "
                        >
                            Create
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
