import React, { createContext, useEffect, useState } from 'react';

export const ScrollTopContext = createContext({
  isVisible: false,
  scrollToTop: () => {
  },
});

interface Props {
  children: React.ReactNode,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
}

const ScrollTopProvider: React.FC<Props> = (props) => {
  const { containerRef } = props;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const clientH = containerRef.current.clientHeight;
        const threshold = clientH * 0.5;
        const scrollPos = containerRef.current.scrollTop;

        if (scrollPos > threshold) {
          setIsVisible((prevState) => {
            if (!prevState) {
              return true;
            }

            return prevState;
          });
          return;
        }

        if (scrollPos < threshold) {
          setIsVisible((prevState) => {
            if (prevState) {
              return false;
            }

            return prevState;
          });
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ScrollTopContext.Provider value={{ isVisible, scrollToTop }}>
      {props.children}
    </ScrollTopContext.Provider>
  );
};

export default ScrollTopProvider;
