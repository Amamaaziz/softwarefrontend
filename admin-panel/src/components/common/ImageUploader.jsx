import { useState } from 'react';
import { X, ImageIcon, Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadApi } from '../../data/index.js';

/**
 * Image field driven by file upload (Cloudinary) or a pasted URL.
 * value: string URL (single mode) or string[] (multiple mode)
 * onChange: (newValue) => void
 */
export default function ImageUploader({ value, onChange, multiple = false, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const urls = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const res = await uploadApi.image(file);
        uploaded.push(res.data.url);
      }

      if (multiple) {
        onChange([...(value || []), ...uploaded]);
      } else {
        onChange(uploaded[0]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const isValidUrl = (str) => /^https?:\/\/.+/i.test(str.trim());

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      toast.error('Enter a valid URL starting with http:// or https://');
      return;
    }

    if (multiple) {
      onChange([...(value || []), trimmed]);
    } else {
      onChange(trimmed);
    }
    setUrlInput('');
  };

  const removeAt = (idx) => {
    if (multiple) {
      const next = [...value];
      next.splice(idx, 1);
      onChange(next);
    } else {
      onChange('');
    }
  };

  const urlRow = (
    <div className="mt-2 flex w-full max-w-xs gap-2">
      <div className="relative flex-1">
        <LinkIcon size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-body/40 dark:text-body-dark/40" />
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          placeholder="Paste image URL"
          className="w-full rounded-lg border border-border py-2 pl-8 pr-2 text-sm text-heading placeholder:text-body/40 focus:border-cta focus:outline-none dark:border-border-dark dark:bg-transparent dark:text-heading-dark dark:placeholder:text-body-dark/40"
          disabled={uploading}
        />
      </div>
      <button
        type="button"
        onClick={handleAddUrl}
        disabled={uploading || !urlInput.trim()}
        className="shrink-0 rounded-lg border border-border px-3 text-sm text-body hover:border-cta hover:text-cta-hover disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark dark:text-body-dark dark:hover:text-cta-dark"
      >
        Add
      </button>
    </div>
  );

  if (multiple) {
    return (
      <div>
        <div className="mb-3 flex flex-wrap gap-3">
          {urls.map((url, idx) => (
            <div key={url + idx} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border dark:border-border-dark">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1 top-1 rounded-full bg-slate-900/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {uploading && (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-border dark:border-border-dark">
              <Loader2 size={18} className="animate-spin text-body/50 dark:text-body-dark/50" />
            </div>
          )}
        </div>
        <label className="flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3.5 py-2.5 text-sm text-body hover:border-cta hover:text-cta-hover dark:border-border-dark dark:text-body-dark dark:hover:text-cta-dark">
          <Upload size={15} />
          {uploading ? 'Uploading…' : `Add ${label.toLowerCase()}${multiple ? 's' : ''}`}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
            disabled={uploading}
          />
        </label>
        {urlRow}
      </div>
    );
  }

  return (
    <div>
      {value ? (
        <div className="group relative mb-3 h-32 w-full max-w-xs overflow-hidden rounded-lg border border-border dark:border-border-dark">
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="mb-3 flex h-32 w-full max-w-xs items-center justify-center rounded-lg border-2 border-dashed border-border text-body/40 dark:border-border-dark dark:text-body-dark/40">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={22} />}
        </div>
      )}
      <label className="flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3.5 py-2.5 text-sm text-body hover:border-cta hover:text-cta-hover dark:border-border-dark dark:text-body-dark dark:hover:text-cta-dark">
        <Upload size={15} />
        {uploading ? 'Uploading…' : value ? `Change ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
          disabled={uploading}
        />
      </label>
      {urlRow}
    </div>
  );
}