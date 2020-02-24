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
      string = (string as Strings)[parts.shift()!];
    }

    // Make sure the string is in fact a string!
    return string != null ? string.toString() : null;
  },

  // Formats empty placeholders (eg. !da.headline.title!)
  empty: (key, config) => `!${config.lang}.${key}!`
});
```