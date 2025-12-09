import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useIsMobile = () => {
  const { width } = useWindowSize();
  return width <= 480;
};

export const useIsTablet = () => {
  const { width } = useWindowSize();
  return width > 480 && width <= 768;
};

export const useIsDesktop = () => {
  const { width } = useWindowSize();
  return width > 768;
};

