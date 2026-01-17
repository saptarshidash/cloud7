import { motion } from 'framer-motion';
import { formatDate, formatFileSize } from '../utils/helper.js';


export default function FolderInfoModal({ folder, info, onClose }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white w-[420px] rounded-2xl shadow-xl p-6"
            >
                <h2 className="text-lg font-semibold mb-4">Folder details</h2>

                <div className="space-y-3 text-sm">
                    <InfoRow label="Name" value={folder.name} />
                    <InfoRow label="Created" value={formatDate(info.createdAt)} />
                    <InfoRow label="Files" value={info.fileCount} />
                    <InfoRow label="Folders" value={info.folderCount} />
                    <InfoRow label="Size" value={formatFileSize(info.sizeBytes)} />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}
