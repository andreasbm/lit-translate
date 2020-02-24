## Customize! (advanced)

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

    // Make sure the string is in fact a string!
    return string != null ? string.toString() : null;
  },

  // Formats empty placeholders (eg. !da.headline.title!)
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

    throw new Error(`The language ${lang} is not supported..`);
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