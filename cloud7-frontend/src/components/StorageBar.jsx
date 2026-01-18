import { motion } from 'framer-motion';

export default function StorageBar({ used, total }) {
    if (total == null || used == null) return null;

    const percent = Math.min(Math.round((used / total) * 100), 100);

    function format(bytes) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }

    const barColor =
        percent > 85
            ? 'bg-red-500'
            : percent > 65
                ? 'bg-yellow-500'
                : 'bg-[#1a73e8]';

    return (
        <div
            className="
        fixed
        bottom-6
        left-6
        w-[240px] max-w-[calc(100vw-2rem)]
        bg-white
        border border-gray-200
        rounded-xl
        shadow-lg
        p-4
        z-40
      "
        >
            <p className="text-sm font-medium text-gray-800 mb-2">
                Storage
            </p>

            {/* Progress track */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${barColor}`}
                />
            </div>

            <p className="mt-2 text-xs text-gray-500">
                {format(used)} of {format(total)} used
            </p>
        </div>
    );
}
