import { X, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from './FormField.jsx';

/**
 * Image field driven entirely by URL — no file upload.
 * value: string URL (single mode) or string[] (multiple mode)
 * onChange: (newValue) => void
 */
export default function ImageUploader({ value, onChange, multiple = false, label = 'Image URL' }) {
  const urls = multiple ? value || [] : value ? [value] : [];

  const handleUrlChange = (newUrl) => {
    if (!newUrl) {
      onChange(multiple ? [] : '');
      return;
    }
    onChange(newUrl);
  };

  const handleAddUrl = (newUrl) => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
    } catch {
      toast.error('Enter a valid image URL (starting with http:// or https://).');
      return;
    }

    onChange([...(value || []), trimmed]);
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
        </div>
        <UrlAddRow onAdd={handleAddUrl} placeholder="https://example.com/image.jpg" />
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
            onClick={() => handleUrlChange('')}
            className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="mb-3 flex h-32 w-full max-w-xs items-center justify-center rounded-lg border-2 border-dashed border-border text-body/40 dark:border-border-dark dark:text-body-dark/40">
          <ImageIcon size={22} />
        </div>
      )}
      <Input
        type="url"
        value={value || ''}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
      />
    </div>
  );
}

function UrlAddRow({ onAdd, placeholder }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd(e.target.value);
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input type="url" placeholder={placeholder} className="flex-1" onKeyDown={handleKeyDown} />
      <button
        type="button"
        onClick={(e) => {
          const input = e.currentTarget.previousElementSibling;
          onAdd(input.value);
          input.value = '';
        }}
        className="shrink-0 rounded-lg bg-cta px-3 py-2.5 text-xs font-semibold text-slate-900 hover:bg-cta-hover"
      >
        Add
      </button>
    </div>
  );
}