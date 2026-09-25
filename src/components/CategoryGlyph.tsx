import React from 'react';

type Props = {
  name: string;
};

export default function CategoryGlyph({name}: Props): React.JSX.Element {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...common}>
      {name === 'business' ? (
        <>
          <path d="M4 7.5h16v11H4z" />
          <path d="M9 7.5V5.7c0-.9.7-1.7 1.7-1.7h2.6c.9 0 1.7.8 1.7 1.7v1.8" />
          <path d="M4 11.5c4.8 2.2 11.2 2.2 16 0" />
          <path d="M10.3 12.7h3.4" />
        </>
      ) : name === 'technology' ? (
        <>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="m7.5 9 2.5 2.5L7.5 14" />
          <path d="M12.5 14H16" />
        </>
      ) : name === 'legal' ? (
        <>
          <path d="M12 4v15" />
          <path d="M6 7h12" />
          <path d="m6 7-3 5h6L6 7Z" />
          <path d="m18 7-3 5h6l-3-5Z" />
          <path d="M8 20h8" />
        </>
      ) : name === 'medical' ? (
        <>
          <path d="M12 20s-7-4.3-7-9.7C5 7.5 6.7 6 8.8 6c1.5 0 2.6.8 3.2 1.8C12.6 6.8 13.7 6 15.2 6 17.3 6 19 7.5 19 10.3 19 15.7 12 20 12 20Z" />
          <path d="M12 10v5" />
          <path d="M9.5 12.5h5" />
        </>
      ) : name === 'lifestyle' ? (
        <>
          <path d="M19.5 4.5C12.5 5 7.8 8 6 13.5c-1 3 1 5.7 4 5.5 5.7-.4 8.7-6.4 9.5-14.5Z" />
          <path d="M5 20c2.4-5 6.2-8.5 11.5-11.2" />
        </>
      ) : name === 'safety' ? (
        <>
          <path d="M12 3.5 19 6v5.1c0 4.5-2.8 7.7-7 9.4-4.2-1.7-7-4.9-7-9.4V6l7-2.5Z" />
          <path d="m8.7 12 2.1 2.1 4.5-4.6" />
        </>
      ) : name === 'creative' ? (
        <>
          <path d="M5 18.5 7 13 16.7 3.3a1.8 1.8 0 0 1 2.5 0l1.5 1.5a1.8 1.8 0 0 1 0 2.5L11 17l-6 1.5Z" />
          <path d="m15.5 4.5 4 4" />
          <path d="M7 13l4 4" />
        </>
      ) : (
        <>
          <path d="M3.5 20V9.5L9 12V8l5.5 3.2V5.5h6V20z" />
          <path d="M7 16h1" />
          <path d="M11 16h1" />
          <path d="M15 16h1" />
          <path d="M18 9h2.5" />
        </>
      )}
    </svg>
  );
}
