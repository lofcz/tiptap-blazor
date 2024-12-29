# TipTap Blazor

This is an opinionated editor built with [TipTap](https://github.com/ueberdosis/tiptap) and [React](https://github.com/facebook/react) bundled into a umd package consumable by Blazor (and other frameworks).

## Getting Started

```js
npm install
npm run build
```

This produces following files in `dist` folder:
- `react.production.min.js`
- `react-dom.production.min.js`
- `tiptap-island.umd.js`
- `style.css`

Unless React is already available in `window`, import it via the first two files in whatever way your system supports. One would be to use the plain old `script` tags:

```html
<script src="react.production.min.js"></script>
<script src="react-dom.production.min.js"></script>
```

Next, import `tiptap-island.umd.js` and `style.css`:

```html
<script src="tiptap-island.umd.js"></script>
<link rel="stylesheet" href="style.css" />
```

*Note that while this is the simplest way, using some loader is recommended.*

To see the above in action, run: `npm run test`.

## Creating an editor

Tiptap Blazor sets `window.TipTapIsland` to a function that can be called to construct an editor instance:

```js
let editor = window["TipTapIsland"].create(pars.id, {
    content: "hello <em>world</em>,
    onUpdate: (html) => {
        console.log(html);
    }
});
```

## API

The following methods are available on the editor:

## API

The following methods are available on the editor:

| Method | Description |
|--------|-------------|
| `setContent(html)` | Sets content of the editor |
| `destroy()` | Removes editor and associated events |
| `setEditable(editable)` | Enables/disables input |
| `isEditable` | Returns whether input is enabled |

## Development

Start Vite environment by running `npm run dev`.
