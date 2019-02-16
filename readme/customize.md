## Customize! (advanced)

If you want you can customize just about anything by overwriting the configuration hooks. Below is an example on what you might want to customize.

```typescript
import { registerTranslateConfig, extract, LanguageIdentifier, Values, Key, ITranslateConfig, ValuesCallback, Translations } from "@appnest/lit-translate";

registerTranslateConfig({

  // Loads the language from the correct path
  loader: (lang: LanguageIdentifier) => fetch(`/assets/i18n/${lang}.json`).then(res => res.json()),

  // Interpolate the values using a [[key]] syntax.
  interpolate: (text: string, values: Values | ValuesCallback) => {
    for (const [key, value] of Object.entries(extract(values))) {
      text = text.replace(new RegExp(`\[\[${key}\]\]`), String(extract(value)));
    }

    return text;
  },

  // Returns a string for a given key
  lookup: (key: Key, config: ITranslateConfig) => {

    // Split the key in parts (example: hello.world)
    const parts = key.split(".");

    // Find the string by traversing through the strings matching the chain of keys
    let string: Strings | string | undefined = config.strings;

    // Do not continue if the string is not defined or if we have traversed all of the key parts
    while (string != null && parts.length > 0) {
      string = (<Strings>string)[parts.shift()!];
    }

    // Make sure the string is in fact a string!
    return string != null ? string.toString() : null;
  },

  // Formats empty placeholders (eg. !da.headline.title!)
  empty: (key: Key, config: ITranslateConfig) => `!${config.lang}.${key}!`
});
```
