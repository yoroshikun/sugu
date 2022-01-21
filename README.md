# Sugu Search

Instant spotlight like search and actions in your browser with Sugu Search. 

Developed by [Drew Hutton](https://github.com/yoroshikun)

## Table of contents

- [Features](#features)
- [Controlling the interface](#controlling-the-interface)
  - [Opening Sugu](#opening-sugu)
  - [Closing Sugu](#closing-sugu)
  - [Switching between dark and light mode](#switching-between-dark-and-light-mode)
- [List of commands](#list-of-commands)
- [Developer contribution guide](#developer-contribution-guide)
- [Special Thanks](#special-thanks)

## Features

- ⚡️ Blazing fast and lightweight UX Built with Svelte
- 💅 Modern Fluid UI
- 🗂 Tab management
- 📚 Bookmarks management
- ⌨ Keyboard shortcuts
- 🔌 Plugin based extendable actions
- 🌙 Dark and light mode
- 🔒 Secure, private no login
- 🧩 Integrations 

Much more not listed...

## Controlling the interface

### Opening Sugu

To open Sugu, simply press `⌘+Shift+K` on Mac or `Ctrl+Shift+K` on Windows. You can change the shortcut by going to chrome://extensions/shortcuts.

Alternatively you can click on the extension icon in the toolbar to toggle it.

### Closing Sugu

To close Sugu you can press `Esc`, click on the background, or press the extension icon.

### Switching between dark and light mode

The dark and light theme in Sugu is currently tied to your system's theme.

On Mac you can change the theme by clicking on the Apple menu (on the top left), opening the System preferences, going into the General section, and then choosing between dark, light, or auto.

On Windows it depends on the OS version. [Here is a guide for Windows 11 and 10.](https://support.microsoft.com/en-us/windows/change-desktop-background-and-colors-176702ca-8e24-393b-15f2-b15b38f69de6#ID0EBF=Windows_11)

After switching the theme you might need to restart Chrome.

## List of commands

You can use a variety of commands with Sugu to perform actions or filter your results.

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
yarn dev
# or npm run dev
```

To build for production, you can run `npm run build` or `yarn build`.
```bash
yarn build
# or npm run build
```
All required files will be copied to the `dist` folder.

### Running Locally / Self Hosting or Testing

You can build and run this extension locally without needing to install though the store.
#### Developers

### Chrome

1. Clone the code with your git client of choice or zip download.
2. Open a terminal and navigate to the root of the project.
3. Run `npm install` or `yarn`.
4. Run `npm run build` or `yarn build`.
5. Open Chrome and navigate to `chrome://extensions/` make sure you enable [developer mode](https://developer.chrome.com/docs/extensions/mv2/faq/#:~:text=You%20can%20start%20by%20turning,a%20packaged%20extension%2C%20and%20more.).
6. Click on the `Load unpacked extension` button, located the public folder and click on the `Load` button.
7. You should now see the extension in the list of extensions. And can use Sugu in the browser.

### Firefox

1. Clone the code with your git client of choice or zip download.
2. Open a terminal and navigate to the root of the project.
3. Run `npm install` or `yarn`.
4. Run `npm run build` or `yarn build`.
5. Delete the `manifest.json` file in the `public` folder, and rename the `manifest.v2.json` file to `manifest.json`. (This is because Firefox does not support v3 manifest files and chrome requires them!)
6. Open Chrome and navigate to `about:debugging` page and click "This Firefox" from the menu.
7. Click on the `Load Temporary Add-on` button, located the public folder and click on the `Load` button.
8. You should now see the extension in the list of extensions. And can use Sugu in the browser.


#### Non-developers

TBA

## Special Thanks

- [Svelte](https://svelte.dev/) - Cybernetically Enhanced Web Apps
- [Omni](https://github.com/alyssaxuu/omni) - Alyssa X's Original Omni Chrome Extension
- [whats.new](https://whats.new/) - Amazing resource for url as shortcuts
- [Fluid UI Icons](https://github.com/microsoft/fluentui-system-icons) - Microsoft Fluent UI Icons
- [Web Extension Polyfill](https://github.com/mozilla/webextension-polyfill) - Web Extension Polyfill

## Disclaimer

### Acknowledgments

This work is highly inspired by [Omni](https://github.com/alyssaxuu/omni) by Alyssa X. This project was originally developed to be a alternative JQuery-less version of Omni, but due to the scope of changes rewrites and features the project has become its own development. The project is offered with the same MIT license so that people are free to take optimizations and implement them back into Omni if wanted, but I highly recommend you checkout and help this project develop further.

## Contact

Any questions, comments or direct feedback you are welcome to contact me with email [Here](mailto:drew.hutton@pm.me) or raise a Github issue.
