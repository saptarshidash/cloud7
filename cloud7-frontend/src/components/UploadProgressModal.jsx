import { motion, AnimatePresence } from 'framer-motion';
import successIcon from '../assets/success.svg';

export default function UploadProgressModal({ progress, done }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                    className="bg-white rounded-2xl p-6 w-[320px] shadow-xl text-center"
                >
                    {!done ? (
                        <>
                            <p className="text-sm font-medium text-gray-800 mb-4">
                                Uploading…
                            </p>

                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: 'easeOut', duration: 0.2 }}
                                    className="h-full bg-[#1a73e8] rounded-full"
                                />
                            </div>

                            <p className="mt-3 text-xs text-gray-500">
                                {progress}%
                            </p>
                        </>
                    ) : (
                        <>
                            <motion.img
                                src={successIcon}
                                alt="Success"
                                className="w-12 h-12 mx-auto mb-3"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />

                            <p className="text-sm font-medium text-green-600">
                                Upload complete
                            </p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
