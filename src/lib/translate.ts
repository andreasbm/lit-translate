export type Values = object;
export type Strings = {[key: string]: string | Strings};
export type CachedTranslation = {values: Values, translation: string};

export enum TranslateEventKind {
	STRINGS_CHANGED = "stringsChanged"
}

export type StringsChangedEvent = {
	previousStrings: Strings | null,
	strings: Strings
};

const stringsCache = new Map<string, Strings>();
let currentStrings: Strings | null = null;
let translationCache: {[key: string]: CachedTranslation} = {};

/**
 * Fetches the strings as JSON from a given path.
 * @param path
 */
export async function loadStrings (path: string): Promise<Strings> {

	// Check in the cache
	if (stringsCache.has(path)) {
		return getStringsFromCache(path);
	}

	// Fetch the strings and default to an empty object to avoid issues if the file does not exist.
	return await fetch(path).then(async (res) => {
		try {
			return await res.json();
		} catch (e) {
			console.error(`The JSON at the path "${path}" appears to be malformed or does not exist.`, e);
			return Promise.resolve({});
		}
	});
}

/**
 * Associated strings with a key in the cache.
 * @param key
 * @param strings
 */
export function addStringsToCache (key: string, strings: Strings) {
	stringsCache.set(key, strings);
}

/**
 * Removes the strings associated with from the cache.
 * @param key
 */
export function removeStringsFromCache (key: string) {
	stringsCache.delete(key);
}

/**
 * Returns the strings associated with a given key.
 * @param key
 */
export function getStringsFromCache (key: string) {
	return stringsCache.get(key);
}

/**
 * Sets the strings for a new language.
 * @param strings
 */
export function setStrings (strings: Strings) {
	translationCache = {};
	const previousStrings = currentStrings;
	currentStrings = strings;
	window.dispatchEvent(new CustomEvent<StringsChangedEvent>(TranslateEventKind.STRINGS_CHANGED, {
		detail: {
			previousStrings,
			strings
		}
	}));
}

/**
 * Interpolates the values into the string.
 * @param text
 * @param values
 */
export function interpolateValues (text: string, values: Values): string {
	for (const [key, value] of Object.entries(values)) {
		text = text.replace(new RegExp(`{{[  ]*${key}[  ]*}}`), value);
	}

	return text;
}

/**
 * Translates a key with optional values.
 * Uses the current strings and string cache to fetch the string.
 * @param key (eg. "common.get_started")
 * @param values (eg. { count: 42 })
 * @param emptyPlaceholder
 */
export function get (key: string,
                     values?: Values,
                     emptyPlaceholder: ((key: string) => string) = ((key) => `[${key}]`)) {

	// Check in the cache
	const cached = translationCache[key];
	if (cached != null && cached.values === values) {
		return cached.translation;
	}

	// Split the key in parts (example: hello.world)
	const parts = key.split(".");

	// Find the translation by traversing through the strings matching the chain of keys
	let translation: string | object = currentStrings || {};
	while (parts.length > 0) {
		translation = translation[parts.shift()];

		// Do not continue if the translation is not defined
		if (translation == null) return emptyPlaceholder(key);
	}

	// Make sure the translation is a string!
	translation = translation.toString();

	// Replace the placeholders
	if (values != null) {
		translation = interpolateValues(translation, values);
	}

	translationCache[key] = {values, translation};
	return translation;
}