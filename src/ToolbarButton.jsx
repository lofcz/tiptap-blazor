import React, { useEffect, useState } from 'react';
import styles from './ToolbarButton.module.scss';
import { loadIcon, isIconAvailable } from './icons';

const ToolbarButton = ({
                           icon,
                           tooltip,
                           isActive,
                           onClick,
                           disabled = false
                       }) => {
    const [IconComponent, setIconComponent] = useState(null);

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

    if (!isIconAvailable(icon)) {
        console.warn(`Icon "${icon}" is not available`);
        return null;
    }

    return (
        <button
            className={`${styles.toolbarButton} ${isActive ? styles.active : ''}`}
            onClick={onClick}
            disabled={disabled}
            data-tooltip={tooltip}
        >
            {IconComponent ? (
                <IconComponent className={styles.toolbarIcon} />
            ) : (
                <div className={styles.iconPlaceholder} />
            )}
        </button>
    );
};

export default ToolbarButton;
