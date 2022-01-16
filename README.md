# SOmni Search

> Disclaimer: This work is highly inspired by [Omni](https://github.com/alyssaxuu/omni) more disclaimer below in the [Disclaimer](#disclaimer) section.

Supercharge your browser workflow with SOmni Search. 

<!-- [👉 Get it now](https://chrome.google.com/webstore/detail/omni/mapjgeachilmcbbokkgcbgpbakaaeehi?hl=en&authuser=0) -->


Developed by [Drew Hutton](https://github.com/yoroshikun) inspired by [Alyssa X](https://alyssax.com)s [Omni](https://github.com/alyssaxuu/omni)

## Table of contents

- [Features](#features)
- [Controlling the interface](#controlling-the-interface)
  - [Opening Omni](#opening-omni)
  - [Closing Omni](#closing-omni)
  - [Switching between dark and light mode](#switching-between-dark-and-light-mode)
- [List of commands](#list-of-commands)
- [Developer contribution guide](#developer-contribution-guide)
- [Special Thanks](#special-thanks)

## Features

- ⚡️ Blazing fast and lightweight UX
- 🗂 Tab management
- 📚 Bookmarks management
- ⌨ Keyboard shortcuts
- 🔌 Plugin based extendable actions
- 🌙 Dark and light mode
- 🔒 Secure, private no login
- 🧩 Integrations 

Much more not listed...

## Controlling the interface

### Opening SOmni

To open SOmni, simply press `⌘+K` on Mac or `Ctrl+K` on Windows. You can change the shortcut by going to chrome://extensions/shortcuts.

Alternatively you can click on the extension icon in the toolbar to toggle it.

### Closing SOmni

To close SOmni you can press `Esc`, click on the background, or press the extension icon.

### Switching between dark and light mode

The dark and light theme in SOmni is currently tied to your system's theme.

On Mac you can change the theme by clicking on the Apple menu (on the top left), opening the System preferences, going into the General section, and then choosing between dark, light, or auto.

On Windows it depends on the OS version. [Here is a guide for Windows 11 and 10.](https://support.microsoft.com/en-us/windows/change-desktop-background-and-colors-176702ca-8e24-393b-15f2-b15b38f69de6#ID0EBF=Windows_11)

After switching the theme you might need to restart Chrome.

## List of commands

You can use a variety of commands with SOmni to perform actions or filter your results.

- **/tabs**: Search your tabs
- **/bookmarks**: Search your bookmarks
- **/history**: Search your browser history
- **/actions**: Search all available actions
- **/remove**: Remove a bookmark or close a tab

## Developers contribution guide

To develop with this extension you need to have npm or yarn installed.
Once you have downloaded the git repo, you can install the dependencies by running `npm install` or `yarn`. This project preferably uses yarn. Please do not commit the npm.lock file.

```bash
yarn
# or npm install
```

To run the extension in development mode, you can run `npm run dev` or `yarn dev`.

```bash
yarn build
# or npm run dev
```

To build for production, you can run `npm run build` or `yarn build`.
```bash
yarn build
# or npm run build
```
All required files will be copied to the `dist` folder.

## Special Thanks

- [Svelte](https://svelte.dev/) - Cybernetically Enhanced Web Apps
- [Omni](https://github.com/alyssaxuu/omni) - Alyssa X's Original Omni Chrome Extension

## Disclaimer

### Acknowledgments

This work is highly inspired by [Omni](https://github.com/alyssaxuu/omni) by Alyssa X. This project was originally developed to be a alternative JQuery-less version of Omni, but due to the scope of changes and rewrites the project has become its own development. The project is offered with the same MIT license so that people are free to take optimizations and implement them back into Omni if wanted.

## Contact

Any questions, comments or direct feedback you are welcome to contact me with email [Here](mailto:drew.hutton@pm.me) or raise a Github issue.
