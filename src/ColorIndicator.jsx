import React, {useState} from 'react'
import {HexColorPicker} from 'react-colorful'

const ColorIndicator = ({color, type = 'text'}) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" className="color-indicator">
            {color ? (
                <rect
                    x="1"
                    y="1"
                    width="14"
                    height="14"
                    fill={color}
                    stroke="#888"
                    strokeWidth="1"
                    rx="2"
                />
            ) : (
                <rect
                    x="1"
                    y="1"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#888"
                    strokeWidth="1"
                    rx="2"
                />
            )}
            {type === 'text' && (
                <path
                    d="M4 12L8 4L12 12"
                    stroke={color ? (isLightColor(color) ? '#000' : '#fff') : '#888'}
                    strokeWidth="1.5"
                    fill="none"
                />
            )}
            {type === 'background' && (
                <rect
                    x="4"
                    y="4"
                    width="8"
                    height="8"
                    fill={color ? (isLightColor(color) ? '#000' : '#fff') : '#888'}
                    opacity="0.3"
                />
            )}
        </svg>
    )
}

const isLightColor = (color) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
}

export default ColorIndicator;