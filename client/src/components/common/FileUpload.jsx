import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";

const FileUpload = ({
  onUpload,
  accept = "*",
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  label,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    async (selectedFiles) => {
      const valid = Array.from(selectedFiles).filter((f) => f.size <= maxSize);
      if (valid.length !== selectedFiles.length) {
        toast.error("Some files exceed the maximum size limit");
      }
      setFiles(valid);
      if (onUpload) {
        setUploading(true);
        try {
          await onUpload(valid);
        } finally {
          setUploading(false);
        }
      }
    },
    [maxSize, onUpload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleChange = (e) => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
      )}

      <motion.div
        whileHover={{ scale: 1.005 }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-200",
          dragOver
            ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-lg shadow-[var(--primary)]/5"
            : "border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface-subtle)]"
        )}
      >
        <div className={cn(
          "rounded-xl p-3.5 transition-all duration-200",
          dragOver
            ? "bg-[var(--primary)]/10 text-[var(--primary)]"
            : "bg-[var(--surface-subtle)] text-[var(--muted-foreground)]"
        )}>
          {uploading ? (
            <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[var(--primary)] border-t-transparent" />
          ) : (
            <Upload size={26} />
          )}
        </div>
        <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">
          {uploading ? "Uploading..." : "Drop files here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {accept !== "*"
            ? `Accepted: ${accept}`
            : "All file types accepted"}
          {" · Max: "}
          {maxSize >= 1024 * 1024
            ? `${(maxSize / 1024 / 1024).toFixed(0)}MB`
            : `${(maxSize / 1024).toFixed(0)}KB`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </motion.div>

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 transition-colors hover:bg-[var(--surface-hover)]"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <File
                  size={16}
                  className="shrink-0 text-[var(--primary)]"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {file.size >= 1024 * 1024
                      ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                      : `${(file.size / 1024).toFixed(1)} KB`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="ml-3 shrink-0 rounded-lg p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
