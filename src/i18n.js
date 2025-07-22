const defaultLocales = {
    en: {
        'bold': 'Bold',
        'italic': 'Italic',
        'strike': 'Strike',
        'code': 'Code',
        'textColor': 'Text Color',
        'backgroundColor': 'Background',
        'customColor': 'Custom color',
        'resetColor': 'Reset color',
    }
};

let locales = defaultLocales;
let currentLocale = 'en';
const subscribers = new Set();

const i18n = {
    async init({ locale = 'en', locales: directLocales, localeFiles }) {
        currentLocale = locale;

        let loadedLocales = {};
        if (localeFiles) {
            for (const [lang, path] of Object.entries(localeFiles)) {
                try {
                    const response = await fetch(path);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch locales from ${path}`);
                    }
                    loadedLocales[lang] = await response.json();
                } catch (error) {
                    console.error(`Error loading locale '${lang}':`, error);
                }
            }
        }

        locales = { ...defaultLocales, ...loadedLocales, ...directLocales };
    },

    subscribe(callback) {
        subscribers.add(callback);
        return () => subscribers.delete(callback);
    },

    setLocale(locale) {
        if (currentLocale === locale) return;
        currentLocale = locale;
        subscribers.forEach(callback => callback());
    },

    t(key) {
        return locales[currentLocale]?.[key] || locales['en']?.[key] || key;
    },
};

export default i18n; 