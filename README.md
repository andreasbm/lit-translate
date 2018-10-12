# @appnest/lit-translate

## 🤔 What is this?

This is a lightweight internationalization (i18n) library for your lit-html based project (or any other project for that matter).

**Features**

* Simple API that can return a translation for a given key using the dot notation (eg. `get("home.header.title")`)
* Works well with JSON based translation structures
* Can interpolate values into the translations
* Customizable (choose your own translations loader, how to interpolate values, empty placeholder etc)
* Caches the translations for maximum performance
* Contains a `lit-html` directive that automatically updates when the language changes
* Approximately 800 bytes gzipped

## 🎉 Install the dependency

```javascript
npm i @appnest/lit-translate
```

## 👍 Step 1 - Define the translations

To take advantage of the translation features you first need to have your translations in a JSON structure.

```json
// en.json
{
  "lang": "en",
  "header": {
    "title": "Hello",
    "subtitle": "World"
  },
  "cta": {
    "awesome": "{{ things }} are awesome!",
    "cats": "Cats"
  }
}
```

## 👌 Step 2 - Register a translate config

Use the `registerTranslateConfig` function to register a loader that loads and parses the translations based on a language identifier.

```javascript
registerTranslateConfig({
  loader: (lang: LanguageIdentifier) => fetch(`/assets/i18n/${lang}.json`).then(res => res.json())
});
```

It is possible to use this function to customize almost everything from the library.

## 🙌 Step 3 - Set the language

Invoke the `use` function to set a language. This function will use the registered loader to load the translations for the language and dispatch a global `langChanged` event. The translations are stored in a cache for the next time the `use` function is called with the same parameters.

```javascript
await use("en");
```

## 💪 Step 4 - Get the translations

To get a translation use the `get` function. Give this function a string of keys (using the dot notation) that points to the desired string in the JSON structure. The example below is based on the translations defined in `step 1`.

```javascript
get("lang"); // "en"
get("header.title"); // "Hello"
get("header.subtitle"); // "World"
```

## ✌️ Step 5 - Interpolate values

Using the `get` function it is possible to interpolate values. As default, you can simply use the `{{ key }}` syntax in your translations and provide an object with values replacing those defined in the translations when using the `get` function. The example below is based on the translations defined in `step 1`.

```javascript
get("cta.awesome", { thing: get("cta.cats") )); // Cats are awesome!
```

## 👊 Step 6 - Use the `translate` directive together with `lit-html`

If you are using `lit-html` you might want to use the `translate` directive. This directive makes sure to automatically update all of the translated parts when the `use` function is called and the global `langChanged` event is dispatched. Note that values have to be returned from a callback due to how the parts are updated.

```javascript
class MyComponent extends LitElement {
  render () {
    html`
      <h1>${translate("header.title")}</h1>
      <p>${translate("header.subtitle")}</p>
      <span>${translate("cta.awesome", () => { return { things: get("cta.cats") }})}</span>
    `;
  }
}
```

## 💥 Step 7 - Customize!

Customize how keys are translated. Below is an example on what you might want to customize.

```javascript
registerTranslateConfig({

    // Loads the language from the correct path
    loader: (lang: LanguageIdentifier) => fetch(`/assets/i18n/${lang}.json`).then(res => res.json()),

    // Interpolate the values using a [[key]] syntax.
    interpolate: (text: string, values: Values) => {
      for (const [key, value] of Object.entries(values)) {
        text = text.replace(new RegExp(`\[\[${key}\]\]`), value);
      }

      return text;
    },

    // Fetches a translation from a given key
    fetchTranslation: (key: string, config: ITranslationConfig) => {

      // Split the key in parts (example: hello.world)
      const parts = key.split(".");

      // Find the translation by traversing through the strings matching the chain of keys
      let translation: string | object = config.translations || {};
      while (parts.length > 0) {
        translation = translation[parts.shift()];

        // Do not continue if the translation is not defined
        if (translation == null) return config.emptyPlaceholder(key, config);
      }

      // Make sure the translation is a string!
      return translation.toString();
  },

  // Writes empty placeholders (eg. [da.headline.title])
  emptyPlaceholder: (key: string, config: ITranslationConfig) => `!${config.lang}.${key}!`
});
```

## 🎉 License

Licensed under [MIT](https://opensource.org/licenses/MIT).