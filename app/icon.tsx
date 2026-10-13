import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 55%, #0ea5e9 100%)',
          borderRadius: '16px',
          color: '#090d16',
          fontWeight: 900,
          fontSize: '32px',
          fontFamily: 'sans-serif',
        }}
      >
        JA
      </div>
    ),
    { ...size }
  );
}
