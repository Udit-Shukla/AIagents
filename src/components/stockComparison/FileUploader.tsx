import React from 'react';

interface FileUploaderProps {
  label: string;
  onFileSelect: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, onFileSelect }) => {
  return (
    <div className="w-full fade-in">
      <label className="block text-sm font-medium text-theme-heading mb-2">
        {label}
      </label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0 file:text-sm file:font-semibold
                   file:bg-[var(--primary)] file:text-white
                   hover:file:bg-[var(--primary-hover)]
                   bg-gray-50 text-gray-700 rounded-lg border border-[var(--border)]
                   transition duration-150 ease-in-out focus:outline-none"
      />
    </div>
  );
};

export default FileUploader;
