'use client'

import { useState } from 'react'
import Header from './components/Header'
import Ticker from './components/Ticker'

/* ── 장소 데이터 ── */
const LOCATIONS = [
  {
    id: 'bakery',
    icon: '🥐',
    label: 'BÄCKEREI',
    korean: '빵집',
    color: '#FF8C42',
    colorDim: 'rgba(255,140,66,.18)',
    colorBorder: 'rgba(255,140,66,.7)',
    colorGlow: 'rgba(255,140,66,.3)',
    level: 'Baby/A1',
    // 지도 위치 (bottom, left 기준 %)
    bottom: '52%',
    left: '8%',
  },
  {
    id: 'station',
    icon: '🚉',
    label: 'BAHNHOF',
    korean: '기차역',
    color: '#78b4e0',
    colorDim: 'rgba(100,160,220,.18)',
    colorBorder: 'rgba(100,160,220,.7)',
    colorGlow: 'rgba(100,160,220,.25)',
    level: 'A1',
    bottom: '58%',
    left: '40%',
  },
  {
    id: 'market',
    icon: '🛒',
    label: 'SUPERMARKT',
    korean: '슈퍼마켓',
    color: '#6BCB77',
    colorDim: 'rgba(106,203,119,.18)',
    colorBorder: 'rgba(106,203,119,.7)',
    colorGlow: 'rgba(106,203,119,.25)',
    level: 'A1',
    bottom: '46%',
    left: '62%',
  },
  {
    id: 'inn',
    icon: '🍺',
    label: 'GASTHAUS',
    korean: '여관',
    color: '#FFB450',
    colorDim: 'rgba(255,180,80,.18)',
    colorBorder: 'rgba(255,180,80,.6)',
    colorGlow: 'rgba(255,180,80,.2)',
    level: 'A1',
    bottom: '40%',
    left: '26%',
  },
  {
    id: 'hospital',
    icon: '🏥',
    label: 'KRANKENHAUS',
    korean: '병원',
    color: '#e88a8a',
    colorDim: 'rgba(232,138,138,.18)',
    colorBorder: 'rgba(232,138,138,.6)',
    colorGlow: 'rgba(232,138,138,.2)',
    level: 'A2',
    bottom: '68%',
    left: '22%',
  },
  {
    id: 'library',
    icon: '📚',
    label: 'BIBLIOTHEK',
    korean: '도서관',
    color: '#b09ad8',
    colorDim: 'rgba(176,154,216,.18)',
    colorBorder: 'rgba(176,154,216,.6)',
    colorGlow: 'rgba(176,154,216,.2)',
    level: 'A2',
    bottom: '72%',
    left: '58%',
  },
  {
    id: 'school',
    icon: '🏫',
    label: 'SCHULE',
    korean: '학교',
    color: '#f0c060',
    colorDim: 'rgba(240,192,96,.18)',
    colorBorder: 'rgba(240,192,96,.6)',
    colorGlow: 'rgba(240,192,96,.2)',
    level: 'A2',
    bottom: '78%',
    left: '35%',
  },
  {
    id: 'park',
    icon: '🌳',
    label: 'PARK',
    korean: '공원',
    color: '#a0c8e0',
    colorDim: 'rgba(160,200,224,.18)',
    colorBorder: 'rgba(160,200,224,.6)',
    colorGlow: 'rgba(160,200,224,.2)',
    level: 'B1',
    bottom: '88%',
    left: '14%',
  },
  {
    id: 'rathaus',
    icon: '🏛️',
    label: 'RATHAUS',
    korean: '시청',
    color: '#c8a878',
    colorDim: 'rgba(200,168,120,.18)',
    colorBorder: 'rgba(200,168,120,.6)',
    colorGlow: 'rgba(200,168,120,.2)',
    level: 'B1',
    bottom: '92%',
    left: '52%',
  },
]

const LEARN_TYPES = [
  { id: 'vocabulary', icon: '📝', label: '단어 퀴즈', color: 'var(--mint)', border: 'var(--mint-border-hi)' },
  { id: 'grammar', icon: '🔬', label: '문법 퀴즈', color: '#c4a8ff', border: 'rgba(180,140,255,.5)' },
  { id: 'conversation', icon: '💬', label: '대화 퀴즈', color: 'var(--loc-bakery)', border: 'rgba(255,140,66,.5)' },
  { id: 'expressions', icon: '🔊', label: '표현 정리', color: 'var(--loc-market)', border: 'rgba(106,203,119,.5)' },
  { id: 'flashcard', icon: '🃏', label: '플래시카드', color: 'var(--loc-inn)', border: 'rgba(255,180,80,.5)' },
  { id: 'mission', icon: '📡', label: '오늘의 미션', color: 'var(--mint)', border: 'var(--mint-border-hi)' },
]

/* ── 별 위치 (고정) ── */
const STARS = [
  { top: '4%', left: '12%', size: 3, delay: '0s', dur: '2.1s' },
  { top: '7%', left: '38%', size: 2, delay: '0.4s', dur: '1.7s' },
  { top: '3%', left: '65%', size: 3, delay: '0.2s', dur: '2.6s' },
  { top: '9%', left: '82%', size: 2, delay: '0.7s', dur: '1.9s' },
  { top: '13%', left: '22%', size: 2, delay: '0.3s', dur: '3.0s' },
  { top: '6%', left: '55%', size: 2, delay: '0.9s', dur: '2.3s' },
  { top: '11%', left: '75%', size: 3, delay: '0.1s', dur: '1.8s' },
  { top: '8%', left: '90%', size: 2, delay: '0.5s', dur: '2.8s' },
  { top: '15%', left: '48%', size: 2, delay: '1.1s', dur: '2.0s' },
  { top: '5%', left: '28%', size: 2, delay: '0.6s', dur: '2.5s' },
]

type Location = typeof LOCATIONS[number]

export default function HomePage() {
  const [selected, setSelected] = useState<Location | null>(null)

  const handleLocationClick = (loc: Location) => {
    setSelected(loc)
  }

  const handleClose = () => {
    setSelected(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>

      {/* ── HEADER ── */}
      <Header title="독일 마을" level="A1" />

      {/* ── MAP AREA (스크롤 가능) ── */}
      <div
        className="map-scroll"
        style={{
          flex: 1,
          position: 'relative',
          background: 'var(--bg-deep)',
        }}
      >
        {/* 지도 내부 — 세로로 길게 (장소 추가될수록 height 늘어남) */}
        <div style={{ position: 'relative', height: '160vh', minHeight: '800px' }}>

          {/* ── 별빛 ── */}
          {STARS.map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderRadius: '50%',
                background: i % 3 === 0 ? '#ffe8a0' : '#ffffff',
                animation: `twinkle ${s.dur} ease-in-out infinite ${s.delay}`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* ── 지평선 노을 ── */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: 'linear-gradient(to top, #3a1a08 0%, #6b2e10 18%, #c45e1a 36%, #e8832a 50%, transparent 72%)',
            opacity: 0.8,
            pointerEvents: 'none',
          }} />

          {/* ── 마을 실루엣 SVG ── */}
          <svg
            style={{
              position: 'absolute',
              bottom: '18%',
              left: 0,
              width: '100%',
              height: '200px',
              pointerEvents: 'none',
            }}
            viewBox="0 0 375 200"
            preserveAspectRatio="xMidYMax meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 뒷배경 언덕 */}
            <ellipse cx="90" cy="210" rx="140" ry="70" fill="#1a0d30" opacity=".95" />
            <ellipse cx="290" cy="215" rx="120" ry="65" fill="#1a0d30" opacity=".95" />

            {/* 건물 실루엣 */}
            <rect x="8" y="130" width="34" height="70" fill="#0f0820" />
            <polygon points="8,130 25,105 42,130" fill="#0f0820" />
            <rect x="52" y="148" width="26" height="52" fill="#0f0820" />
            <rect x="88" y="140" width="20" height="60" fill="#0f0820" />
            <polygon points="88,140 98,118 108,140" fill="#0f0820" />
            {/* 교회 첨탑 */}
            <rect x="160" y="120" width="28" height="80" fill="#0f0820" />
            <polygon points="160,120 174,90 188,120" fill="#0f0820" />
            <rect x="171" y="82" width="6" height="18" fill="#0f0820" />
            {/* 오른쪽 건물들 */}
            <rect x="230" y="142" width="32" height="58" fill="#0f0820" />
            <polygon points="230,142 246,116 262,142" fill="#0f0820" />
            <rect x="270" y="155" width="40" height="45" fill="#0f0820" />
            <rect x="322" y="148" width="28" height="52" fill="#0f0820" />

            {/* 창문 불빛 */}
            <rect x="16" y="148" width="8" height="6" fill="#FF8C42" opacity=".8" rx="1" />
            <rect x="28" y="148" width="8" height="6" fill="#FFB450" opacity=".6" rx="1" />
            <rect x="57" y="162" width="7" height="5" fill="#FF8C42" opacity=".7" rx="1" />
            <rect x="166" y="138" width="8" height="6" fill="#FFB450" opacity=".8" rx="1" />
            <rect x="178" y="138" width="8" height="6" fill="#FF8C42" opacity=".6" rx="1" />
            <rect x="237" y="158" width="9" height="6" fill="#FFB450" opacity=".7" rx="1" />
            <rect x="250" y="158" width="9" height="6" fill="#FF8C42" opacity=".5" rx="1" />
            <rect x="278" y="168" width="8" height="5" fill="#FFB450" opacity=".6" rx="1" />
            <rect x="292" y="168" width="8" height="5" fill="#FF8C42" opacity=".7" rx="1" />

            {/* 지면 */}
            <rect x="0" y="188" width="375" height="12" fill="#1a0d08" />
          </svg>

          {/* ── 가로등 ── */}
          <div style={{
            position: 'absolute',
            bottom: '22%',
            left: '18%',
            zIndex: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{
              width: '3px',
              height: '70px',
              background: '#3a2a1a',
            }} />
            <div style={{
              width: '20px',
              height: '3px',
              background: '#3a2a1a',
              marginTop: '-70px',
              marginLeft: '8px',
            }} />
            <div
              className="lamp-glow"
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#FF8C42',
                marginTop: '-3px',
                marginLeft: '8px',
              }}
            />
          </div>

          {/* ── 자갈길 ── */}
          <div style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '28px',
            height: '35%',
            background: 'rgba(42,26,16,.7)',
            borderRadius: '14px',
            pointerEvents: 'none',
          }} />

          {/* ── 장소 핀 ── */}
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="no-select"
              onClick={() => handleLocationClick(loc)}
              style={{
                position: 'absolute',
                bottom: loc.bottom,
                left: loc.left,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                zIndex: 15,
                transition: 'transform .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12) translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                background: loc.colorDim,
                border: `2px solid ${loc.colorBorder}`,
                boxShadow: `0 0 12px ${loc.colorGlow}`,
              }}>
                {loc.icon}
              </div>
              <div style={{
                fontSize: '7px',
                fontFamily: 'Space Mono, monospace',
                fontWeight: 700,
                color: loc.color,
                background: `rgba(0,0,0,.5)`,
                padding: '2px 5px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(4px)',
              }}>
                {loc.label}
              </div>
            </div>
          ))}

          {/* ── UFO ── */}
          <div
            className="float-anim no-select"
            style={{
              position: 'absolute',
              bottom: '60%',
              right: '8%',
              zIndex: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              animationDuration: '3s',
            }}
            onClick={() => alert('오늘의 미션! (곧 구현 예정)')}
          >
            <div className="ufo-glow" style={{ fontSize: '40px' }}>🛸</div>
            <div
              className="badge badge-mint glow-pulse"
              style={{ fontSize: '8px' }}
            >
              MY SHIP!
            </div>
          </div>

          {/* ── 강아지 외계인 캐릭터 ── */}
          <div
            className="float-anim"
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animationDuration: '2.2s',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '34px' }}>🐶</div>
            {/* 그림자 */}
            <div style={{
              width: '24px',
              height: '5px',
              background: 'rgba(0,0,0,.25)',
              borderRadius: '50%',
              filter: 'blur(2px)',
              marginTop: '2px',
            }} />
          </div>

        </div>{/* end map inner */}
      </div>{/* end map-scroll */}

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── 장소 팝업 (Bottom Sheet) ── */}
      {selected && (
        <>
          {/* 오버레이 */}
          <div
            className="bottom-sheet-overlay"
            onClick={handleClose}
          />

          {/* 시트 */}
          <div
            className="bottom-sheet"
            style={{ animation: 'slide-up .35s cubic-bezier(.22,1,.36,1)' }}
          >
            {/* 시트 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{selected.icon}</span>
                <div>
                  <div style={{
                    fontSize: '8px',
                    color: 'var(--mint)',
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: 700,
                  }}>
                    LOCATION · {selected.level}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>
                    {selected.label}
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      fontWeight: 400,
                      marginLeft: '6px',
                    }}>
                      {selected.korean}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              fontSize: '9px',
              color: 'var(--text-dim)',
              fontFamily: 'Space Mono, monospace',
              marginBottom: '14px',
            }}>
              학습 유형을 선택하세요 — WÄHLE DEINEN LERNMODUS
            </div>

            {/* 학습 유형 버튼 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}>
              {LEARN_TYPES.map((type) => (
                <button
                  key={type.id}
                  className="btn no-select"
                  onClick={() => {
                    // TODO: 라우팅 연결 예정
                    alert(`${selected.label} → ${type.label}`)
                  }}
                  style={{
                    background: `rgba(${type.color === 'var(--mint)' ? '78,205,196' : '255,255,255'},.08)`,
                    borderColor: type.border,
                    color: type.color,
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '12px 8px',
                    fontSize: '10px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  )
}