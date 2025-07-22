import React, {useState, useCallback, useEffect} from 'react'
import {HexColorPicker} from 'react-colorful'
import ColorIndicator from './ColorIndicator.jsx'
import {ICONS, isIconAvailable, loadIcon} from "./icons.js";
import pickerStyles from './ColorPicker.module.scss'
import buttonStyles from './ToolbarButton.module.scss';
import i18n from './i18n.js';

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
        <div className={pickerStyles.colorPickerWrapper}>
            <button
                className={pickerStyles.colorPickerTrigger}
                onClick={() => onOpenChange()}
                data-tooltip={label}
            >
                {IconComponent ? (
                    <IconComponent className={buttonStyles.toolbarIcon} />
                ) : (
                    <div className={pickerStyles.iconPlaceholder} />
                )}
                <div
                    className={pickerStyles.colorIndicator}
                    style={{
                        backgroundColor: currentColor || 'transparent',
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
                                data-tooltip={i18n.t('customColor')}
                            />
                            <button
                                className="color-option unset-color-button"
                                onClick={handleResetColor}
                                data-tooltip={i18n.t('resetColor')}
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