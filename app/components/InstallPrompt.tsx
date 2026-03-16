// app/components/InstallPrompt.tsx
'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isIOS, setIsIOS] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [showIOSGuide, setShowIOSGuide] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // 이미 설치된 경우 (standalone 모드)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // 이전에 닫은 경우
        if (localStorage.getItem('pwa_dismissed') === 'true') {
            setDismissed(true)
            return
        }

        // iOS 감지
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
        setIsIOS(ios)

        // Android Chrome — beforeinstallprompt 이벤트
        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') setIsInstalled(true)
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        setDismissed(true)
        localStorage.setItem('pwa_dismissed', 'true')
    }

    // 표시 조건 없으면 렌더링 안 함
    if (isInstalled || dismissed) return null
    if (!deferredPrompt && !isIOS) return null

    return (
        <>
            {/* iOS 설치 가이드 모달 */}
            {showIOSGuide && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 100,
                        background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'flex-end',
                    }}
                    onClick={() => setShowIOSGuide(false)}
                >
                    <div
                        style={{
                            width: '100%', background: '#1e1235',
                            border: '2px solid rgba(78,205,196,.4)',
                            borderRadius: '20px 20px 0 0',
                            padding: '20px 20px 40px',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                홈 화면에 추가하기
                            </div>
                            <button onClick={() => setShowIOSGuide(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '18px', cursor: 'pointer' }}>
                                ✕
                            </button>
                        </div>

                        {/* 강아지 안내 */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '28px' }}>🐶</span>
                            <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '10px 10px 10px 2px', padding: '10px 12px', flex: 1 }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    앱처럼 설치하면 더 편해요!<br />아래 순서대로 따라해봐요 🛸
                                </div>
                            </div>
                        </div>

                        {/* 단계 */}
                        {[
                            { step: '1', icon: '⬆️', text: 'Safari 하단의 공유 버튼을 탭해요' },
                            { step: '2', icon: '➕', text: '"홈 화면에 추가"를 선택해요' },
                            { step: '3', icon: '✅', text: '오른쪽 상단 "추가"를 눌러요' },
                        ].map(item => (
                            <div key={item.step} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 0',
                                borderBottom: item.step !== '3' ? '1px solid rgba(255,255,255,.06)' : 'none',
                            }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'rgba(78,205,196,.15)', border: '1.5px solid rgba(78,205,196,.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700,
                                    flexShrink: 0,
                                }}>{item.step}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {item.icon} {item.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 하단 설치 배너 */}
            <div style={{
                background: 'var(--bg-panel)',
                borderTop: '1px solid rgba(78,205,196,.2)',
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
            }}>
                {/* 앱 아이콘 */}
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: '#3d2460', border: '2px solid var(--mint)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                    boxShadow: '0 0 10px rgba(78,205,196,.3)',
                }}>🐶</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        홈 화면에 추가
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                        앱처럼 설치하면 더 편해요!
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {/* 닫기 */}
                    <button onClick={handleDismiss} style={{
                        background: 'transparent', border: '1.5px solid rgba(255,255,255,.15)',
                        borderRadius: '8px', color: 'var(--text-dim)',
                        fontSize: '11px', padding: '6px 10px', cursor: 'pointer',
                        fontFamily: 'Space Mono, monospace',
                    }}>
                        나중에
                    </button>

                    {/* 설치 버튼 */}
                    {isIOS ? (
                        <button onClick={() => setShowIOSGuide(true)} className="btn btn-mint" style={{ padding: '6px 14px', fontSize: '11px' }}>
                            설치 방법
                        </button>
                    ) : (
                        <button onClick={handleInstall} className="btn btn-mint" style={{ padding: '6px 14px', fontSize: '11px' }}>
                            설치하기
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}