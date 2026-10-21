'use client';
import { useEffect } from 'react';

export default function PWAInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered successfully.'))
        .catch((err) => console.log('Service Worker registration failed:', err));
    }
  }, []);

  return null;
}
