## Advanced Customisation

If you want you can customise just about anything by overwriting the configuration hooks. Below is an example of what you can customise. Try it as a playground [here](https://codepen.io/andreasbm/pen/gOoVGdQ?editors=0010).

```typescript
import { registerTranslateConfig, extract, get, use } from "lit-translate";

registerTranslateConfig({

  // Loads the language by returning a JSON structure for a given language
  loader: lang => {
    switch (lang) {

      // English strings
      case "en":
        return {
          app: {
            title: "This is a title",
            description: "This description is {placeholder}!"
          },
          awesome: "awesome"
        };

      // Danish strings
      case "da":
        return {
          app: {
            title: "Dette er en titel",
            description: "Denne beskrivelse er {placeholder}!"
          },
          awesome: "fed"
        };
        
      default:
        throw new Error(`The language ${lang} is not supported..`);
    }
  },

  // Interpolate the values using a [[ key ]] syntax.
  interpolate: (text, values) => {
    for (const [key, value] of Object.entries(extract(values || {}))) {
      text = text.replace(new RegExp(`{.*${key}.*}`, `gm`), String(extract(value)));
    }


    return text;
  },

  // Returns a string for a given key
  lookup: (key, config) => {

    // Split the key in parts (example: hello.world)
    const parts = key.split(" -> ");

    // Find the string by traversing through the strings matching the chain of keys
    let string = config.strings;

    // Shift through all the parts of the key while matching with the strings.
    // Do not continue if the string is not defined or if we have traversed all the key parts
    while (string != null && parts.length > 0) {
      string = string[parts.shift()];
    }

    // Make sure the string is in fact a string!
    return string != null ? string.toString() : null;
  },

  // Formats empty placeholders (eg. !da.headline.title!) if lookup returns null
  empty: (key, config) => `!${config.lang}.${key}!`
});

use("en").then(() => {
  get("app -> description", { placeholder: get("awesome") }); // Will return "This description is awesome"
});
```

### Format text with `IntlMessageFormat`

[IntlMessageFormat](https://www.npmjs.com/package/intl-messageformat) is a library that formats ICU message strings with number, date, plural, and select placeholders to create localized messages using [ICU placeholders](https://unicode-org.github.io/icu/userguide/format_parse/messages/). This library is a good addition to `lit-translate`. You can add it to the interpolate hook to get the benefits as shown in the following example. Try the example as a playground [here](https://codepen.io/andreasbm/pen/rNpXGPW?editors=0010).

```typescript
import { registerTranslateConfig, extract } from "lit-translate";
import { IntlMessageFormat } from "intl-messageformat";

registerTranslateConfig({
  loader: lang => {
    switch (lang) {
      case "en":
        return {
          photos: `You have {numPhotos, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}`
        };
    
      case "en":
        return {
          photos: `Du har {numPhotos, plural, =0 {ingen billeder.} =1 {et billede.} other {# billeder.}}`
        };
    
      default:
        throw new Error(`The language ${lang} is not supported..`);
    }
  },

  // Use the "intl-messageformat" library for formatting.
  interpolate: (text, values, config) => {
    const msg = new IntlMessageFormat(text, config.lang);
    return msg.format(extract(values));
  }
});

use("en").then(() => {
  get("photos", {numPhotos: 0}); // Will return "You have no photos"
  get("photos", {numPhotos: 1}); // Will return "You have one photo."
  get("photos", {numPhotos: 5}); // Will return "You have 5 photos."
});
```

### Use the default translations as keys

Inspired by [GNU gettext](https://en.wikipedia.org/wiki/Gettext) you can use the default translation as keys. The benefit of doing this is that you will save typing time and reduce code clutter. You can use [xgettext](https://www.gnu.org/software/gettext/manual/html_node/xgettext-Invocation.html) to extract the translatable strings from your code and then use [po2json](https://github.com/mikeedwards/po2json) to turn your `.po` files into `.json` files. The following code shows an example of how you could implement this. Try it as a playground [here](https://codepen.io/andreasbm/pen/RwxXjJX?editors=0010).

```typescript
import { registerTranslateConfig, use, get } from "lit-translate";

registerTranslateConfig({
  loader: lang => {
    switch (lang) {
      case "da":
        return {
          "The page is being loaded...": "Siden indlæses..."
        };
      default:
        return {};
    }
  },
  lookup: (key, config) => config.strings != null && config.strings[key] != null ? config.strings[key].toString() : key,
  empty: key => key,
});

get("The page is being loaded..."); // Will return "The page is being loaded..."

use("da").then(() => {
  get("The page is being loaded..."); // Will return "Siden indlæses..."
});
```