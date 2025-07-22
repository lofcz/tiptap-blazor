import {ReactRenderer} from '@tiptap/react'
import {computePosition, flip, shift, offset} from '@floating-ui/dom';
import {EmojiList} from './EmojiList'

export default
{
    char: ":",

    items: ({ editor, query }) => {
        return editor.storage.emoji.emojis
            .filter(({ shortcodes, tags }) => {
                return (
                    shortcodes.find(shortcode => shortcode.startsWith(query.toLowerCase()))
                    || tags.find(tag => tag.startsWith(query.toLowerCase()))
                )
            })
            .slice(0, 5)
    },

    allow: ({ editor, state, range }) => {
        const from = range.from

        const textBefore = editor.state.doc.textBetween(
            Math.max(0, from - 1),
            from
        )

        const textAfter = editor.state.doc.textBetween(
            from,
            Math.min(editor.state.doc.content.size, from + 1)
        )

        const isValid = (
            (from === 1 || /[\s\n]/.test(textBefore) || textBefore === '') &&
            textAfter.length > 0
        )

        return isValid
    },

    allowSpaces: false,

    render: () => {
        let component
        let popup

        const showPopup = (props) => {
            popup = document.createElement('div');
            popup.classList.add('suggestion-popup');
            document.body.appendChild(popup);

            component = new ReactRenderer(EmojiList, {
                props,
                editor: props.editor,
            }, popup);
            
            const virtualEl = {
                getBoundingClientRect: props.clientRect,
            };

            computePosition(virtualEl, popup, {
                placement: 'bottom-start',
                middleware: [offset(10), flip(), shift()],
            }).then(({x, y}) => {
                Object.assign(popup.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
            });
        };

        const hidePopup = () => {
            if (popup) {
                popup.remove();
                popup = null;
            }
            if (component) {
                component.destroy();
                component = null;
            }
        };

        return {
            onStart: props => {
                showPopup(props);
            },

            onUpdate(props) {
                if (component) {
                    component.updateProps(props);

                    const virtualEl = {
                        getBoundingClientRect: props.clientRect,
                    };

                    computePosition(virtualEl, popup, {
                        placement: 'bottom-start',
                        middleware: [offset(10), flip(), shift()],
                    }).then(({x, y}) => {
                        Object.assign(popup.style, {
                            left: `${x}px`,
                            top: `${y}px`,
                        });
                    });
                } else {
                    showPopup(props);
                }
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    hidePopup();
                    return true
                }

                return component.ref?.onKeyDown(props)
            },

            onExit() {
                hidePopup();
            },
        }
    },
}