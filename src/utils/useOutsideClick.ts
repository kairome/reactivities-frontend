import { useEffect, useRef } from 'react';

const useOutsideClick = (action: () => void) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current !== null && containerRef.current.contains((e.target as Node))) {
        return;
      }

      action();
    };

    window.addEventListener('mouseup', handleOutsideClick, true);

    return () => window.removeEventListener('mouseup', handleOutsideClick, true);
  }, []);

  return containerRef;
};

export default useOutsideClick;
