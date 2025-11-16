import { useEffect } from 'react';

type Props = { title?: string; description?: string; } & { children?: React.ReactNode };

export default function Seo({ title, description, children }: Props) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  return <>{children}</>;
}
