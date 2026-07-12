import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './FormField.jsx';

/**
 * Comma/Enter-delimited tag input used for `technologies` (portfolio),
 * `requirements` / `responsibilities` (jobs).
 */
export default function TagInput({ value = [], onChange, placeholder = 'Type and press Enter...' }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (idx) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-canvas p-2 focus-within:border-cta focus-within:ring-1 focus-within:ring-cta dark:border-border-dark dark:bg-surface-dark">
      {value.map((tag, idx) => (
        <span
          key={tag + idx}
          className="inline-flex items-center gap-1 rounded-md bg-cta/10 px-2 py-1 text-xs font-medium text-cta-hover dark:bg-cta/15 dark:text-cta-dark"
        >
          {tag}
          <button type="button" onClick={() => removeTag(idx)} aria-label={`Remove ${tag}`}>
            <X size={12} />
          </button>
        </span>
      ))}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="min-w-[120px] flex-1 border-0 p-0.5 focus:ring-0"
      />
    </div>
  );
}
