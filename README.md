# DocJump

DocJump provides a fuzzy finder (on hitting `Ctrl+G`) for methods, fields etc. in documentation pages for popular
software development libraries and frameworks including Java and Python. Open source and works completely offline.

The default hotkey to launch DocJump is `Ctrl+G`, but can be customized in the add-on's options page. The icon in the
URL bar can also be clicked to launch DocJump.

Here's a preview of what this add-on offers:

![GIF Preview](https://github.com/sharat87/docjump/blob/master/media/preview.gif)

## Get it

[![Get DocJump for Firefox](https://github.com/sharat87/docjump/blob/master/media/ext-firefox.png)](https://addons.mozilla.org/en-US/firefox/addon/docjump/)

## Build Instructions

Make sure you have Node.js `v14.15` and yarn `v1.22`.

To build the firefox extension, run the following commands:

```sh
yarn install --frozen-lockfile
make firefox
```

The firefox extension should now be located at `dist/firefox-docjump.zip`.

To build the chrome extension, run the following commands:

```sh
yarn install --frozen-lockfile
make chrome
```

The chrome extension should now be located at `dist/chrome-docjump.zip`.

## Support

If you face any problems with the add-on, or want support for a new documentation site, please raise an issue on GitHub.
I'd ask to open an issue even before working on a PR (if you are), so we don't end up duplicating work on the same
thing. Thanks!

I developed this in my spare time (weekends), because I sorely needed it. Just `Ctrl+F` to find what I want was not
easy. There's *too many* results from `Ctrl+F` that are not what I'm after. This add-on solved it for me.

As such, only Firefox is currently supported since I don't use Chrome. I may publish it on Chrome WebStore later.

If you want to [buy me a coffee](https://www.buymeacoffee.com/sharat87) to share your support, sure. I'd appreciate it
very much.

## License

This add-on's source code is licensed using the [MIT License](https://addons.mozilla.org/addon/docjump/).
