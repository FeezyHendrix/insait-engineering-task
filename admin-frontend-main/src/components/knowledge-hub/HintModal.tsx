import { KnowledgeItem } from "@/lib/types";
import { useState, useEffect } from "react";

interface HintModalProps {
  isOpen: boolean;
  item: KnowledgeItem;
  onSave: (hint: string, previousHint: string, toDelete?: boolean) => void;
  onClose: () => void;
}

export const HintModal = ({ isOpen, item, onSave, onClose }: HintModalProps) => {
  const [hint, setHint] = useState<string>(item.hint || "");
  const [previousHint, setPreviousHint] = useState<string>(item.hint || "");

  useEffect(() => {
    setHint(item.hint || "");
    setPreviousHint(item.hint || "");
  }, [item]);

  if (!isOpen) return null;

  const handleDelete = () => {
    setHint("");
    onSave("", previousHint, true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {item.hint ? "Edit" : "Add"} hint for {item.name}
        </h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Enter a hint..."
        />
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => onSave(hint, previousHint)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Save
          </button>
          {item.hint && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              Remove Hint
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
