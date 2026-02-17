'use client';
import { useState, useEffect } from 'react';

type ScreenSize = {
  width: number | null;
  height: number | null;
};

const useScreenWidth = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: null,
    height: null,
  });

  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize(); // Set initial size
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return screenSize;
};

export default useScreenWidth;
