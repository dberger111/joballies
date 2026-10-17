import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '2px solid #60a5fa',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '15px',
          fontFamily: 'sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        JA
      </div>
    ),
    { ...size }
  );
}
