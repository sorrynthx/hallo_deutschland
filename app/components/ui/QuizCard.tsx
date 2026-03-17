import React, { ReactNode } from 'react'

interface QuizCardProps {
    children: ReactNode
    onClick?: () => void
    style?: React.CSSProperties
    className?: string
}

export function QuizCard({ children, onClick, style, className }: QuizCardProps) {
    return (
        <div
            className={`card ${className || ''}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    )
}
