export type Values = object;
export type Strings = {[key: string]: string | Strings};
export type CachedTranslation = {values: Values, translation: string};

export enum TranslateEvent {
	STRINGS_CHANGED = "stringsChanged"
}

const stringsCache = new Map<string, Strings>();
let currentStrings: Strings | null = null;
let translationCache: {[key: string]: CachedTranslation} = {};

/**
 * Fetches the strings as JSON from a given path.
 * @param path
 */
export async function getStrings (path: string): Promise<Strings> {

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
 * Adds strings to the cache for a path.
 * @param path
 * @param strings
 */
export function addStringsToCache (path: string, strings: Strings) {
	stringsCache.set(path, strings);
}

/**
 * Removes the strings with the given path from the cache.
 * @param path
 */
export function removeStringsFromCache (path: string) {
	stringsCache.delete(path);
}

/**
 * Returns the strings from a given path.
 * @param path
 */
export function getStringsFromCache (path: string) {
	return stringsCache.get(path);
}

/**
 * Sets the strings for a new language.
 * @param newStrings
 */
export function setStrings (newStrings: Strings) {
	translationCache = {};
	currentStrings = newStrings;
	window.dispatchEvent(new CustomEvent(TranslateEvent.STRINGS_CHANGED, {detail: currentStrings}));
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