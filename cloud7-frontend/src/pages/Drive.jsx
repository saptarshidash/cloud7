import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import FabMenu from '../components/FabMenu';
import FilePreviewModal from '../components/FilePreviewModal';
import ItemMenu from '../components/ItemMenu';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import StorageBar from '../components/StorageBar';

import {
    fetchFolders,
    fetchFiles,
    createFolder,
    deleteFile,
    deleteFolder,
    fetchStorageUsage, fetchFileInfo
} from '../api/client';

import { uploadFileWithProgress } from '../api/uploadWithProgress';

import folderIcon from '../assets/folder.svg';
import fileIcon from '../assets/file.svg';
import moreIcon from '../assets/more-blue-filled.svg';
import { downloadFile } from '../utils/download';
import FileInfoModal from "../components/FileInfoModal.jsx";
import { fetchFolderInfo } from '../api/client';
import FolderInfoModal from '../components/FolderInfoModal';
import NewFolderModal from "../components/NewFolderModal.jsx";


export default function Drive({ user }) {
    const menuRef = useRef(null);
    const { userId, firstName, lastName } = user;
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

    // ---------------- DATA ----------------
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [storage, setStorage] = useState(null);
    const [folderInfo, setFolderInfo] = useState(null);
    const [folderInfoData, setFolderInfoData] = useState(null);

    // ---------------- UI ----------------
    const [previewFile, setPreviewFile] = useState(null);
    const [menuItem, setMenuItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);
    const [newFolderOpen, setNewFolderOpen] = useState(false);


    //  upload progress (NEW)
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const profileRef = useRef(null);
    const fileInputRef = useRef(null);

    // ---------------- OUTSIDE CLICK (PROFILE) ----------------
    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // ---------------- Outside click menu ------------------
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuItem(null);
            }
        }

        if (menuItem) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuItem]);


    // ---------------- LOAD CONTENT ----------------
    async function loadContent(folderId) {
        setLoading(true);

        const [folderData, fileData] = await Promise.all([
            fetchFolders(userId, folderId),
            fetchFiles(userId, folderId)
        ]);

        setFolders(folderData);
        setFiles(fileData);
        setLoading(false);
    }

    useEffect(() => {
        if (!userId) return;

        loadContent(currentFolderId);

        fetchStorageUsage(userId)
            .then(setStorage)
            .catch(console.error);
    }, [userId, currentFolderId]);

    // ---------------- NAVIGATION ----------------
    function handleFolderClick(folder) {
        setBreadcrumbs(prev =>
            currentFolderId === null ? [folder] : [...prev, folder]
        );
        setCurrentFolderId(folder.id);
    }

    function goToRoot() {
        setBreadcrumbs([]);
        setCurrentFolderId(null);
    }

    function goToBreadcrumb(folder, index) {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        setCurrentFolderId(folder.id);
    }

    // ---------------- ACTIONS ----------------
    function triggerUpload() {
        fileInputRef.current.click();
    }

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);
        setUploadSuccess(false);

        try {
            await uploadFileWithProgress(
                file,
                currentFolderId,
                userId,
                percent => setUploadProgress(percent)
            );

            setUploadSuccess(true);

            await loadContent(currentFolderId);
            fetchStorageUsage(userId).then(setStorage);

            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                setUploadSuccess(false);
            }, 1200);
        } catch {
            setUploading(false);
            alert('Upload failed');
        }
    }

    async function handleCreateFolder() {
        setNewFolderOpen(true);
    }

    async function createFolderFromModal(name) {
        await createFolder(name, currentFolderId, userId);
        setNewFolderOpen(false);
        loadContent(currentFolderId);
    }


    async function showInfo(item, type) {
        if (type === 'folder') {
            const info = await fetchFolderInfo(item.id);
            setFolderInfo(item);
            setFolderInfoData(info);
        }

        if (type === 'file') {
            const info = await fetchFileInfo(item.id);
            setFileInfo(info);
        }
    }

    // ---------------- RENDER ----------------
    return (
        <div className="relative min-h-screen p-8 bg-[#f8f9fa] text-gray-800">
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* HEADER */}
            <div className="mb-8">
                <div className="flex items-start gap-4 mb-3">
                    {/* Avatar */}
                    <div ref={profileRef} className="relative">
                        <button
                            onClick={() => setProfileOpen(v => !v)}
                            className="w-9 h-9 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-semibold text-sm hover:opacity-90 transition"
                        >
                            {initials}
                        </button>

                        {profileOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                                <button
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    onClick={() => {
                                        alert('Profile coming soon');
                                        setProfileOpen(false);
                                    }}
                                >
                                    Profile
                                </button>

                                <button
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        window.dispatchEvent(
                                            new CustomEvent('navigate', { detail: 'trash' })
                                        );
                                    }}
                                >
                                    Trash
                                </button>

                                <div className="h-px bg-gray-200 my-1" />

                                <button
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        window.location.reload();
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Greeting + storage */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                            Hi, {firstName}
                        </h1>

                        {storage && (
                            <StorageBar used={storage.used} total={storage.total} />
                        )}
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 pt-2 text-gray-500 text-sm">
          <span
              onClick={goToRoot}
              className="cursor-pointer hover:text-blue-600"
          >
            home
          </span>

                    {breadcrumbs.map((folder, idx) => (
                        <span key={folder.id} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              <span
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => goToBreadcrumb(folder, idx)}
              >
                {folder.name}
              </span>
            </span>
                    ))}
                </div>
            </div>

            {/* CONTENT */}
            {loading ? (
                <p className="text-gray-500"></p>
            ) : (
                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(160px,160px))] gap-4"
                >
                    {/* FOLDERS */}
                    {folders.map(folder => (
                        <div
                            key={`folder-${folder.id}`}
                            className="relative group h-[140px] bg-gray-50 border border-gray-300 rounded-xl p-3 shadow hover:shadow-lg"
                        >
                            <div
                                onClick={() => handleFolderClick(folder)}
                                className="flex flex-col items-center justify-center cursor-pointer h-full"
                            >
                                <img src={folderIcon} className="w-10 h-10 mb-2" />
                                <p className="text-[13px] text-center line-clamp-2">
                                    {folder.name}
                                </p>
                            </div>

                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setMenuItem({ type: 'folder', id: folder.id });
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                            >
                                <img src={moreIcon} className="w-5 h-5" />
                            </button>

                            {menuItem?.type === 'folder' &&
                                menuItem.id === folder.id && (
                                    <div ref={menuRef}>
                                        <ItemMenu
                                            onInfo={() => showInfo(folder, 'folder')}
                                            onPrimaryAction={() => {
                                                setDeleteTarget({ type: 'folder', data: folder });
                                                setMenuItem(null);
                                            }}
                                            onClose={() => setMenuItem(null)}
                                        />
                                    </div>
                                )}
                        </div>
                    ))}

                    {/* FILES */}
                    {files.map(file => (
                        <div
                            key={`file-${file.id}`}
                            className="relative group h-[140px] bg-gray-50 border border-gray-300 rounded-xl p-3 shadow hover:shadow-lg"
                        >
                            <div
                                onClick={() => setPreviewFile(file)}
                                className="flex flex-col items-center justify-center cursor-pointer h-full"
                            >
                                <img src={fileIcon} className="w-10 h-10 mb-2" />
                                <p className="text-[13px] text-center line-clamp-2">
                                    {file.name}
                                </p>
                            </div>

                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setMenuItem({ type: 'file', id: file.id });
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                            >
                                <img src={moreIcon} className="w-5 h-5" />
                            </button>

                            {menuItem?.type === 'file' &&
                                menuItem.id === file.id && (
                                    <div ref={menuRef}>
                                    <ItemMenu
                                        onInfo={() => showInfo(file, 'file')}
                                        onDownload={async () => {
                                            await downloadFile(
                                                `/files/${file.id}/preview`,
                                                file.name
                                            );
                                            setMenuItem(null);
                                        }}
                                        onPrimaryAction={() => {
                                            setDeleteTarget({ type: 'file', data: file });
                                            setMenuItem(null);
                                        }}
                                        onClose={() => setMenuItem(null)}
                                    />
                                    </div>
                                )}
                        </div>
                    ))}
                </motion.div>
            )}

            <FabMenu onUpload={triggerUpload} onCreateFolder={handleCreateFolder} />

            {previewFile && (
                <FilePreviewModal
                    file={previewFile}
                    onClose={() => setPreviewFile(null)}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    itemName={deleteTarget.data.name}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={async () => {
                        deleteTarget.type === 'file'
                            ? await deleteFile(deleteTarget.data.id)
                            : await deleteFolder(deleteTarget.data.id);

                        setDeleteTarget(null);
                        loadContent(currentFolderId);
                        fetchStorageUsage(userId).then(setStorage);
                    }}
                />
            )}

            {/* UPLOAD PROGRESS MODAL (NEW, ISOLATED) */}
            {uploading && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white w-[320px] rounded-xl shadow-xl p-6">
                        {!uploadSuccess ? (
                            <>
                                <p className="text-sm font-medium mb-3">Uploading…</p>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="h-full bg-[#1a73e8]"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {uploadProgress}%
                                </p>
                            </>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl">
                                    ✓
                                </div>
                                <p className="mt-3 text-sm font-medium text-green-600">
                                    Upload complete
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {/* SHOW FILE INFO */}
            {fileInfo && (
                <FileInfoModal
                    info={fileInfo}
                    onClose={() => setFileInfo(null)}
                />
            )}

            {/* SHOW FOLDER INFO */}
            {folderInfo && folderInfoData && (
                <FolderInfoModal
                    folder={folderInfo}
                    info={folderInfoData}
                    onClose={() => {
                        setFolderInfo(null);
                        setFolderInfoData(null);
                    }}
                />
            )}

            {/* NEW FOLDER MODAL */}
            <NewFolderModal
                open={newFolderOpen}
                onClose={() => setNewFolderOpen(false)}
                onCreate={createFolderFromModal}
            />


        </div>
    );
}
