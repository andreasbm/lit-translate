<h1 align="center">lit-translate</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/lit-translate?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/lit-translate.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/lit-translate"><img alt="NPM Version" src="https://img.shields.io/npm/v/lit-translate.svg" height="20"/></a>
<a href="https://david-dm.org/andreasbm/lit-translate"><img alt="Dependencies" src="https://img.shields.io/david/andreasbm/lit-translate.svg" height="20"/></a>
<a href="https://github.com/andreasbm/lit-translate/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/andreasbm/lit-translate.svg" height="20"/></a>
<a href="https://www.webcomponents.org/element/lit-translate"><img alt="Published on webcomponents.org" src="https://img.shields.io/badge/webcomponents.org-published-blue.svg" height="20"/></a>
<a href="https://github.com/web-padawan/awesome-lit-html"><img alt="undefined" src="https://awesome.re/badge.svg" height="20"/></a>
	</p>

<p align="center">
  <b>A lightweight blazing-fast internationalization (i18n) library for your next web-based project</b></br>
  <sub>Go here to try the playground <a href='https://codepen.io/andreasbm/pen/MWWXPNO?editors=1010'>https://codepen.io/andreasbm/pen/MWWXPNO?editors=1010</a>. Go here to see a demo <a href="https://appnest-demo.firebaseapp.com/lit-translate">https://appnest-demo.firebaseapp.com/lit-translate</a>.<sub>
</p>

<br />


* Simple API that can return a translation for a given key (out of the box you can use the dot notation eg. `get("home.header.title")`)
* Works very well with JSON based translation data-structures
* Can interpolate values into the strings
* Customize just about everything (eg. choose your own translations loader, how to interpolate values, empty placeholder and how to look up the strings)
* Caches the translations for maximum performance
* Contains a `lit-html` directive that automatically updates when the language changes
* Approximately 800 bytes minified & gzipped (2kb without)

<img src="https://raw.githubusercontent.com/andreasbm/lit-translate/master/example.gif" width="600">


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#table-of-contents)

## ➤ Table of Contents

* [➤ Installation](#-installation)
* [➤ 1. Define the translations](#-1-define-the-translations)
* [➤ 2. Register the translate config](#-2-register-the-translate-config)
* [➤ 3. Set the language](#-3-set-the-language)
* [➤ 4. Get the translations](#-4-get-the-translations)
* [➤ 5. Interpolate values](#-5-interpolate-values)
* [➤ 6. Use the `translate` directive with `lit-html`](#-6-use-the-translate-directive-with-lit-html)
* [➤ Wait for strings to be loaded before displaying the component](#-wait-for-strings-to-be-loaded-before-displaying-the-component)
* [➤ Customize! (advanced)](#-customize-advanced)
	* [Format text with `IntlMessageFormat`](#format-text-with-intlmessageformat)
	* [Using the default translations as keys](#using-the-default-translations-as-keys)
* [➤ License](#-license)


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#installation)

## ➤ Installation

```js
npm i lit-translate
```

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#1-define-the-translations)

## ➤ 1. Define the translations

To take advantage of the translation features you need to be able to provide your translations as a JSON structure. You are able to configure how these strings are loaded, but to make things simple you are encouraged to maintain your translations as `.json` files - one for each language you support.

```json
// en.json
{
  "header": {
    "title": "Hello",
    "subtitle": "World"
  },
  "cta": {
    "awesome": "things are awesome!",
    "cats": "Cats"
  }
}
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#2-register-the-translate-config)

## ➤ 2. Register the translate config

Use the `registerTranslateConfig` function to register a loader that loads and parses the translations based on a language identifier. In the example below, a loader is registered which loads a `.json` file with translations for a given language.

```js
import { registerTranslateConfig } from "lit-translate";

registerTranslateConfig({
  loader: lang => fetch(`/assets/i18n/${lang}.json`).then(res => res.json())
});
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#3-set-the-language)

## ➤ 3. Set the language

Invoke the `use` function to set a language. This function will use the registered loader from [step 1](#-1-define-the-translations) to load the strings for the language and dispatch a global `langChanged` event.

```js
import { use } from "lit-translate";

use("en");
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#4-get-the-translations)

## ➤ 4. Get the translations

To get a translation use the `get` function. Give this function a string of keys (using the dot notation) that points to the desired translation in the JSON structure. The example below is based on the translations defined in [step 1](#-1-define-the-translations).

```js
import { get } from "lit-translate";

get("header.title"); // "Hello"
get("header.subtitle"); // "World"
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#5-interpolate-values)

## ➤ 5. Interpolate values

When using the `get` function it is possible to interpolate values (eg. replace the placeholders with content). As default, you can simply use the `key` syntax in your translations and provide an object with values replacing those defined in the translations when using the `get` function. The example below is based on the strings defined in [step 1](#-1-define-the-translations).

```js
import { get } from "lit-translate";

get("cta.awesome", { things: get("cta.cats") }); // Cats are awesome!
```



[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#6-use-the-translate-directive-with-lit-html)

## ➤ 6. Use the `translate` directive with `lit-html`

If you are using `lit-html` or `lit-element` you might want to use the `translate` directive. This directive makes sure to automatically update all of the translated parts when the `use` function is called with a new language and the global `langChanged` event is dispatched. Note that values have to be returned from callbacks to refresh the translated values. If your strings contain HTML you can use the `translateUnsafeHTML` directive.

```js
import { translate, translateUnsafeHTML } from "lit-translate";
import { LitElement, html } from "lit-element";

class MyComponent extends LitElement {
  render () {
    html`
      <h1>${translate("header.title")}</h1>
      <p>${translate("header.subtitle")}</p>
      <span>${translate("cta.awesome", { things: () => get("cta.cats") })}</span>
      <span>${translateUnsafeHTML("footer.html")}</span>
    `;
  }
}
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#wait-for-strings-to-be-loaded-before-displaying-the-component)

## ➤ Wait for strings to be loaded before displaying the component

Sometimes you want to avoid the empty placeholders being shown initially before any of the translation strings has been loaded. To avoid this issue you might want to defer the first update of the component. Here's an example of what you could do if using `lit-element`.

```js
import { use, translate } from "lit-translate";
import { LitElement, html } from "lit-element";

export class MyApp extends LitElement {

  // Construct the component
  constructor () {
    super();
    this.hasLoadedStrings = false;
  }

  // Defer the first update of the component until the strings have been loaded to avoid empty strings being shown
  shouldUpdate (changedProperties) {
    return this.hasLoadedStrings && super.shouldUpdate(changedProperties);
  }

  // Load the initial language and mark that the strings have been loaded.
  async connectedCallback () {
    super.connectedCallback();

    await use("en");
    this.hasLoadedStrings = true;
  }

  // Render the component
  protected render () {
    return html`
      <p>${translate("title")}</p>
    `;
  }
}

customElements.define("my-app", MyApp);
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#customize-advanced)

## ➤ Customize! (advanced)

If you want you can customize just about anything by overwriting the configuration hooks. Below is an example on what you might want to customize.

```js
import { registerTranslateConfig, extract } from "lit-translate";

registerTranslateConfig({

  // Loads the language from the correct path
  loader: lang => fetch(`/assets/i18n/${lang}.json`).then(res => res.json()),

  // Interpolate the values using a [[key]] syntax.
  interpolate: (text, values) => {
    for (const [key, value] of Object.entries(extract(values))) {
      text = text.replace(new RegExp(`\[\[${key}\]\]`, `gm`), String(extract(value)));
    }

    return text;
  },

  // Returns a string for a given key
  lookup: (key, config) => {

    // Split the key in parts (example: hello.world)
    const parts = key.split(".");

    // Find the string by traversing through the strings matching the chain of keys
    let string = config.strings;

    // Do not continue if the string is not defined or if we have traversed all of the key parts
    while (string != null && parts.length > 0) {
      string = string[parts.shift()];
    }

    // Make sure the string is a string!
    return string != null ? string.toString() : null;
  },

  // Formats empty placeholders (eg. !da.headline.title!) if lookup returns null
  empty: (key, config) => `!${config.lang}.${key}!`
});
```

### Format text with `IntlMessageFormat`

[IntlMessageFormat](https://www.npmjs.com/package/intl-messageformat) is a library that formats ICU Message strings with number, date, plural, and select placeholders to create localized messages. This library is a good addition to `lit-translate`. You can add it to the interpolate hook to get the benefits as shown in the following example.

```js
import { registerTranslateConfig, extract } from "lit-translate";
import { IntlMessageFormat } from "intl-messageformat";

registerTranslateConfig({
  loader: lang => {
    switch (lang) {
      case "en":
        return {
          photos: `You have {numPhotos, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}`
        };
    }
  },

  // Use the "intl-messageformat" library for formatting.
  interpolate: (text, values, config) => {
    const msg = new IntlMessageFormat(text, config.lang);
    return msg.format(extract(values));
  },
});

use("en");

get("photos", {numPhotos: 0}); // Will return "You have no photos"
get("photos", {numPhotos: 1}); // Will return "You have one photo."
get("photos", {numPhotos: 5}); // Will return "You have 5 photos."
```

### Using the default translations as keys

Inspired by [GNU gettext](https://en.wikipedia.org/wiki/Gettext) you can use the default translation as keys. The benefit of doing this is that you will save typing time and reduce code clutter. You can use [xgettext](https://www.gnu.org/software/gettext/manual/html_node/xgettext-Invocation.html) to extract the translatable strings from your code and then use [po2json](https://github.com/mikeedwards/po2json) to turn your `.po` files into `.json` files. The following code shows an example of how you could implement this.

```js
import { registerTranslateConfig, use, get } from "lit-translate";

registerTranslateConfig({
  lookup: (key, config) => config.strings != null ? config.strings[key] : key,
  empty: key => key,
  loader: lang => {
    switch (lang) {
      case "da":
        return {
          "The page is being loaded...": "Siden indlæses..."
        };
    }
  }
});

use("en");
get("The page is being loaded..."); // Will return "The page is being loaded..."

use("da");
get("The page is being loaded..."); // Will return "Siden indlæses..."
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).