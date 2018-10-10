# @appnest/lit-translate

## 🤔 What is this?

This is a lightweight internationalization (i18n) library for your lit-html based project (or any other project for that matter).

**Features**

* Simple API that can return a translation for a given key using the dot notation (eg. `get("home.header.title")`)
* Register a translations loader and choose how to parse and load the files yourself.
* Works with well with JSON based translation structure.
* Can interpolate values into the translations.
* Caches the translations for maximum performance.
* Contains a `lit-html` directive that automatically updates when the language updates.
* Approximately 800 bytes gzipped.

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

## 👌 Step 2 - Register a translations loader

Use the `registerLoader` function to register a loader that loads and parses the translations based on a language identifier.

```javascript
registerLoader((lang: LanguageIdentifier) => fetch(`/assets/i18n/${lang}.json`).then(res => res.json()));
```

## 🙌 Step 3 - Set the language

Invoke the `use` function to use a language. This function will use the registered loader to load the translations and dispatch a global `langChanged` event. The translations are stored in an internal cache for the next time the `use` function is called with the same parameters.

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

Using the `get` function it is possible to interpolate values. Simply use the `{{ key }}` syntax in your translations and provide an object with values replacing those defined in the translations when using the `get` function. The example below is based on the translations defined in `step 1`.

```javascript
get("cta.awesome", { thing: get("cta.cats") )); // Cats are awesome!
```

## 👊 Step 6 - Use the `translate` directive

If you are using `lit-html` you might want to use the `translate` directive. This directive makes sure to automatically update all of the translated parts when the `use` function is called and the global `langChanged` event is dispatched.

```javascript
class MyComponent extends LitElement {
	render () {
		html`
			<h1>${translate("header.title")}</h1>
			<p>${translate("header.subtitle")}</p>
			<span>${translate("cta.awesome", {things: get("cta.cats") })}</span>
		`;
	}
}
```

## 🎉 License

Licensed under [MIT](https://opensource.org/licenses/MIT).