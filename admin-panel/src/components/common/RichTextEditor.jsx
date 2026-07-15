// import { useMemo, useRef, useState, useEffect } from 'react';
// import JoditEditor from 'jodit-react';
// import { useTheme } from '../../context/ThemeContext.jsx';

// /**
//  * Shared rich-text editor used anywhere HTML content is authored:
//  * Service descriptions, Portfolio challenge/solution/result, Blog body.
//  */
// export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...', minHeight = 260 }) {
//   const { theme } = useTheme();
//   const hasMountedWithValue = useRef(false);
//   const [remountKey, setRemountKey] = useState(0);

//   useEffect(() => {
//     if (!hasMountedWithValue.current && value) {zzz
//       hasMountedWithValue.current = true;
//       setRemountKey((k) => k + 1);
//     }
//   }, [value]);

//   const config = useMemo(
//     () => ({
//       readonly: false,
//       placeholder,
//       minHeight,
//       theme: theme === 'dark' ? 'dark' : 'default',
//       toolbarAdaptive: false,
//       statusbar: false,
//       showCharsCounter: false,
//       showWordsCounter: false,
//       showXPathInStatusbar: false,
//       buttons: [
//         'bold', 'italic', 'underline', 'strikethrough', '|',
//         'ul', 'ol', '|',
//         'font', 'fontsize', 'paragraph', '|',
//         'link', 'image', '|',
//         'align', 'undo', 'redo', '|',
//         'source',
//       ],
//       style: { background: theme === 'dark' ? '#0F172A' : '#FFFFFF' },
//     }),
//     [theme, placeholder, minHeight]
//   );

//   return (
//     <JoditEditor
//       key={remountKey}
//       value={value || ''}
//       config={config}
//       onBlur={(newContent) => onChange(newContent)}
//     />
//   );
// }