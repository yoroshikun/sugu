# Omni Svelte

![Preview](preview.gif)
<br>
<br>
> This is a svelte rebuild of the entire project for educational purposes

The most powerful interface for Chrome 🔥

With Omni you can use Chrome like a pro. Manage tabs, bookmarks, your browser history, perform all sorts of actions and more with a simple command interface.

[👉 Get it now](https://chrome.google.com/webstore/detail/omni/mapjgeachilmcbbokkgcbgpbakaaeehi?hl=en&authuser=0)

<a href="https://www.producthunt.com/posts/omni-3?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-omni-3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=326242&theme=light&period=daily" alt="Omni - The all-in-one tool to supercharge your productivity | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Made by [Alyssa X](https://alyssax.com) redeveloped into Svelte by [Drew Hutton](https://github.com/yoroshikun)

## Table of contents

- [Features](#features)
- [Controlling the interface](#controlling-the-interface)
  - [Opening Omni](#opening-omni)
  - [Closing Omni](#closing-omni)
  - [Switching between dark and light mode](#switching-between-dark-and-light-mode)
- [List of commands](#list-of-commands)
- [Libraries used](#libraries-used)

## Features

🗄 Switch, open, close, and search your tabs<br> 📚 Browse and manage your bookmarks<br> 🔍 Search your browsing history<br> ⚡️ 50+ actions to improve your productivity<br> 🔮 Special commands to filter and perform more actions<br> 🧩 Integrations with Notion, Figma, Docs, Asana...<br> ⌨️ Shortcuts for actions such as muting, pinning, bookmarking...<br> ⚙️ Advanced settings to help troubleshoot browsing issues<br> 🌙 Dark mode<br> ...and much more - all for free & no sign in needed!

## Controlling the interface

### Opening Omni

To open Omni, simply press `⌘+K` on Mac or `Ctrl+K` on Windows. You can change the shortcut by going to chrome://extensions/shortcuts.

Alternatively you can click on the extension icon in the toolbar to toggle it.

### Closing Omni

To close Omni you can press `Esc`, click on the background, or press the extension icon.

### Switching between dark and light mode

The dark and light theme in Omni is tied to your system's theme.

On Mac you can change the theme by clicking on the Apple menu (on the top left), opening the System preferences, going into the General section, and then choosing between dark, light, or auto.

On Windows it depends on the OS version. [Here is a guide for Windows 11 and 10.](https://support.microsoft.com/en-us/windows/change-desktop-background-and-colors-176702ca-8e24-393b-15f2-b15b38f69de6#ID0EBF=Windows_11)

After switching the theme you might need to restart Chrome.

## List of commands (TODO)

You can use a variety of commands with Omni to perform actions or filter your results.

- **/tabs**: Search your tabs
- **/bookmarks**: Search your bookmarks
- **/history**: Search your browser history
- **/actions**: Search all available actions
- **/remove**: Remove a bookmark or close a tab

## Dev notes

To develop with this extension you need to have npm or yarn installed.
Once you have downloaded the git repo, you can install the dependencies by running `npm install` or `yarn install`.

```bash
npm install
# or yarn install
```

To run the extension in development mode, you can run `npm dev` or `yarn dev`.

```bash
npm dev
# or yarn dev
```

To build for production, you can run `npm build` or `yarn build`.
```bash
npm build
# or yarn build
```
All required files will be copied to the `dist` folder.

## Libraries used

- [Svelte](https://svelte.dev/) - Modern Framework for building the future web

