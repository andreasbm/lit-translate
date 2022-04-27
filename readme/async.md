## Asynchronous and Encapsulated Translations

If you have a lot of strings it might not make sense to load them all at once. In `lit-translate` you can have as many translation configs as you want to. As shown in the example below, the trick to encapsulating the translations and loading them asynchronously is to create a new translation config and use it instead of the global `translateConfig`. We then make sure to provide it to the library functions (such as `use`, `get` and `translate`) and keep the selected language in sync with the global one by listening for the `langChanged` event.

```typescript
import { ITranslateConfig, listenForLangChanged, translateConfig, use, get } from "lit-translate";

// Create a new translation config
const asyncTranslateConfig: ITranslateConfig = {
  ...translateConfig,
  loader: lang => fetch(`my-component.${lang}.json`).then(res => res.json()),
  empty: () => ""
}

// Initially set the language of asyncTranslateConfig to match the language of translateConfig.
// When calling the use function, make sure to provide asyncTranslateConfig.
if (translateConfig.lang != null) {
  use(translateConfig.lang, asyncTranslateConfig);
}

// Whenever the language of translateConfig changes also update the language of the asyncTranslateConfig to load the strings.
listenForLangChanged(({lang}) => {
  if (asyncTranslateConfig.lang !== lang) {
    use(lang, asyncTranslateConfig);
  }
});

// When getting translations, provide asyncTranslateConfig to the library functions
get("title", undefined, asyncTranslateConfig);
```