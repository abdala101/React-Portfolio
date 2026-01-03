// api/og.jsx
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge', // This makes it incredibly fast
};

export default function handler(request) {
  // You can even pass query params like ?title=My%20Project
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Abdala Farah';
  const subtitle = searchParams.get('subtitle') || 'Full Stack Software Engineer';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a', // Your site's dark mode background
          backgroundImage: 'radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Decorative Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
            zIndex: -1,
          }}
        />

        {/* Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1
            style={{
              fontSize: 60,
              fontWeight: 900,
              background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 30,
              color: '#94a3b8',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Fake "Code" Badge */}
        <div
          style={{
            marginTop: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 50,
            padding: '10px 30px',
            color: 'white',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Build. Ship. Scale.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}