import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  // 로고 이미지 fetch
  const logoUrl = new URL('/images/logo-pc.png', request.url).toString().replace('api/og/onlinemkt', '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Grid Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Logo - 오른쪽 위 */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            zIndex: 20,
            display: 'flex',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="폴라애드"
            width={180}
            height={50}
            style={{
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 70px',
            position: 'relative',
            zIndex: 10,
            height: '100%',
          }}
        >
          {/* Top Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '30px',
                boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
              }}
            >
              <span style={{ fontSize: '24px' }}>✨</span>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                2026 새해 특별 프로모션
              </span>
              <span style={{ fontSize: '24px' }}>✨</span>
            </div>
          </div>

          {/* Title - 한 줄로 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              온라인마케팅
            </span>
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#60a5fa',
              }}
            >
              올인원 패키지
            </span>
          </div>

          {/* Promotion Cards - 더 크게 */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '24px',
              flex: 1,
            }}
          >
            {/* Card 1 - Best Deal */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '36px 48px',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0.15) 100%)',
                borderRadius: '28px',
                border: '3px solid rgba(245,158,11,0.8)',
                position: 'relative',
                flex: 1,
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
              }}
            >
              {/* BEST Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-18px',
                  right: '32px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '18px',
                  fontSize: '20px',
                  fontWeight: 900,
                  boxShadow: '0 6px 20px rgba(239,68,68,0.6)',
                }}
              >
                BEST
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                <span style={{ color: '#fbbf24', fontSize: '40px', fontWeight: 900 }}>선착순</span>
                <span style={{ color: '#fff', fontSize: '100px', fontWeight: 900, textShadow: '0 4px 24px rgba(245,158,11,0.9)', lineHeight: 1 }}>10</span>
                <span style={{ color: '#fbbf24', fontSize: '40px', fontWeight: 900 }}>개 기업</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#fbbf24', fontSize: '32px', fontWeight: 'bold', background: 'rgba(245,158,11,0.3)', padding: '6px 16px', borderRadius: '12px' }}>
                  특별할인
                </span>
                <span style={{ color: 'white', fontSize: '28px' }}>+</span>
                <span style={{ color: '#22c55e', fontSize: '32px', fontWeight: 'bold', background: 'rgba(34,197,94,0.2)', padding: '6px 16px', borderRadius: '12px' }}>
                  2년 자동화
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '36px 48px',
                background: 'linear-gradient(135deg, rgba(96,165,250,0.25) 0%, rgba(96,165,250,0.1) 100%)',
                borderRadius: '28px',
                border: '3px solid rgba(96,165,250,0.6)',
                flex: 1,
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(96,165,250,0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                <span style={{ color: '#60a5fa', fontSize: '40px', fontWeight: 900 }}>선착순</span>
                <span style={{ color: '#fff', fontSize: '100px', fontWeight: 900, textShadow: '0 4px 24px rgba(96,165,250,0.9)', lineHeight: 1 }}>20</span>
                <span style={{ color: '#60a5fa', fontSize: '40px', fontWeight: 900 }}>개 기업</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#22c55e', fontSize: '32px', fontWeight: 'bold', background: 'rgba(34,197,94,0.2)', padding: '6px 16px', borderRadius: '12px' }}>
                  2년 자동화
                </span>
                <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>무료 제공</span>
              </div>
            </div>
          </div>

          {/* Features with SVG Icons */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            {/* 인쇄물 디자인 - Palette Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r="0.5" fill="#f59e0b"/>
                <circle cx="17.5" cy="10.5" r="0.5" fill="#f59e0b"/>
                <circle cx="8.5" cy="7.5" r="0.5" fill="#f59e0b"/>
                <circle cx="6.5" cy="12.5" r="0.5" fill="#f59e0b"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '17px' }}>인쇄물 디자인</span>
            </div>

            {/* 자체개발 홈페이지 - Globe Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '17px' }}>자체개발 홈페이지</span>
            </div>

            {/* 마케팅 자동화 - Zap Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '17px' }}>마케팅 자동화</span>
            </div>

            {/* DB접수 알림 - Bell Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '17px' }}>DB접수 알림</span>
            </div>
          </div>

          {/* Bottom - URL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 'auto',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
              polarad.co.kr/onlinemkt
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
