import { motion } from 'framer-motion';
import { formatDate, formatFileSize} from '../utils/helper.js'

export default function FileInfoModal({ info, onClose }) {
    if (!info) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-xl p-6"
            >
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                    File details
                </h2>

                <div className="space-y-3 text-sm text-gray-700">
                    <InfoRow label="Name" value={info.name} />
                    <InfoRow label="Type" value={info.contentType || 'Unknown'} />
                    <InfoRow label="Size" value={`${formatFileSize(info.sizeBytes)}`} />
                    <InfoRow
                        label="Uploaded"
                        value={formatDate(info.uploadedAt)}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
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
        <div className="flex justify-between gap-4">
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-900 text-right truncate max-w-[240px]">
        {value}
      </span>
        </div>
    );
}
