import React, {useState, useCallback, useEffect} from 'react'
import {HexColorPicker} from 'react-colorful'
import ColorIndicator from './ColorIndicator.jsx'
import {ICONS, isIconAvailable, loadIcon} from "./icons.js";
import styles from './ColorPicker.module.scss'

const COLORS = [
    ['#958DF1', '#F98181', '#FBBC88'],
    ['#FAF594', '#70CFF8', '#94FADB'],
    ['#B9F18D', '#000000', '#CCCCCC'],
]

const ColorPicker = ({
                         editor,
                         type = 'text',
                         currentColor,
                         onColorChange,
                         label,
                         isOpen,
                         onOpenChange,
                         icon
                     }) => {

    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [IconComponent, setIconComponent] = useState(null)

    useEffect(() => {
        let mounted = true;

        const loadIconComponent = async () => {
            if (isIconAvailable(icon)) {
                const Component = await loadIcon(icon);
                if (mounted && Component) {
                    setIconComponent(() => Component);
                }
            }
        };

        loadIconComponent();

        return () => {
            mounted = false;
        };
    }, [icon]);

    useEffect(() => {
        if (!isOpen) {
            setShowCustomPicker(false)
        }
    }, [isOpen])

    const handleColorSelect = (color) => {
        onColorChange(color)
        onOpenChange(false)
    }

    const handleResetColor = (e) => {
        e.stopPropagation()
        handleColorSelect(null)
    }

    const handleCustomPickerClick = (e) => {
        e.stopPropagation()
        setShowCustomPicker(!showCustomPicker)
    }

    const handleCustomColorChange = useCallback((color) => {
        onColorChange(color)
    }, [onColorChange])


    return (
        <div className={styles.colorPickerWrapper}>
            <button
                className={styles.colorPickerTrigger}
                onClick={() => onOpenChange()}
                data-tooltip={label}
            >
                {IconComponent ? (
                    <IconComponent className={styles.toolbarIcon} />
                ) : (
                    <div className={styles.iconPlaceholder} />
                )}
                <div
                    className={styles.colorIndicator}
                    style={{
                        backgroundColor: currentColor || 'transparent',
                        border: currentColor ? 'none' : `1px solid var(--gray-3)`
                    }}
                />
            </button>

            {isOpen && (
                <div
                    className="color-picker-dropdown"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="color-grid">
                        {COLORS.map((row, rowIndex) => (
                            <div key={rowIndex} className="color-row">
                                {row.map((color) => (
                                    <button
                                        key={color}
                                        className={`color-option ${
                                            currentColor === color ? 'is-active' : ''
                                        }`}
                                        style={{backgroundColor: color}}
                                        onClick={() => handleColorSelect(color)}
                                        data-tooltip={color}
                                    />
                                ))}
                            </div>
                        ))}
                        <div className="color-row special-buttons">
                            <button
                                className="color-option custom-color-button"
                                onClick={handleCustomPickerClick}
                                data-tooltip="Custom color"
                            />
                            <button
                                className="color-option unset-color-button"
                                onClick={handleResetColor}
                                data-tooltip="Reset color"
                            />
                        </div>
                    </div>
                    {showCustomPicker && (
                        <div
                            className="custom-color-picker-popup"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <HexColorPicker
                                color={currentColor}
                                onChange={handleCustomColorChange}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


export default ColorPicker