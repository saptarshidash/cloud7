export default function DeleteConfirmModal({
                                               itemName,
                                               onConfirm,
                                               onCancel
                                           }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="
        w-[380px]
        bg-white
        rounded-2xl
        shadow-xl
        border border-gray-200
        p-6
      ">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Move to Trash?
                </h2>

                <p className="text-sm text-gray-600 mb-6">
          <span className="font-medium text-gray-800">
            {itemName}
          </span>{" "}
                    will be moved to Trash. You can restore it later.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="
              px-4 py-2
              text-sm font-medium
              text-gray-700
              hover:bg-gray-100
              rounded-lg
            "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="
              px-4 py-2
              text-sm font-medium
              bg-red-600
              text-white
              hover:bg-red-700
              rounded-lg
            "
                    >
                        Move to Trash
                    </button>
                </div>
            </div>
        </div>
    );
}
