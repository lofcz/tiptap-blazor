const prefix = "./images/";

const ICONS = {
    'bold': () => import('./images/bold.svg?react'),
    'italic': () => import('./images/italic.svg?react'),
    'strike': () => import('./images/strike.svg?react'),
    'align-left': () => import('./images/align-left.svg?react'),
    'align-center': () => import('./images/align-center.svg?react'),
    'align-right': () => import('./images/align-right.svg?react'),
    'align-justify': () => import('./images/align-justify.svg?react'),
    'list-bulleted': () => import('./images/list-bulleted.svg?react'),
    'list-numbers': () => import('./images/list-numbers.svg?react'),
    'link': () => import('./images/link.svg?react'),
    'unlink': () => import('./images/unlink.svg?react'),
    'image': () => import('./images/image.svg?react'),
    'code': () => import('./images/code.svg?react'),
    'clean': () => import('./images/clean.svg?react'),
    'undo': () => import('./images/undo.svg?react'),
    'redo': () => import('./images/redo.svg?react'),
};

const iconCache = new Map();

export const loadIcon = async (name) => {
    try {
        if (iconCache.has(name)) {
            return iconCache.get(name);
        }

        if (!ICONS[name]) {
            throw new Error(`Icon "${name}" is not defined`);
        }

        const module = await ICONS[name]();
        const Icon = module.default;

        iconCache.set(name, Icon);
        return Icon;
    } catch (error) {
        console.error(`Failed to load icon: ${name}`, error);
        return null;
    }
};

export const isIconAvailable = (name) => {
    return name in ICONS;
};

export const getAvailableIcons = () => {
    return Object.keys(ICONS);
};
