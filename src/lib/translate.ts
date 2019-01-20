import { ITranslationConfig, Key, LangChangedEvent, LanguageIdentifier, Strings, TranslateEventKind, Translation, Values, ValuesCallback } from "./model";

/**
 * Default configuration object.
 */
export const defaultTranslateConfig: (() => ITranslationConfig) = () => {
	return {
		loader: () => Promise.resolve({}),
		empty: key => `[${key}]`,
		lookup: lookup,
		interpolate: interpolate,
		translationCache: {},
		lang: null,
		strings: null
	};
};

// The current configuration.
export let translateConfig: ITranslationConfig = defaultTranslateConfig();

/**
 * Registers a translation config.
 * @param config
 */
export function registerTranslateConfig (config: Partial<ITranslationConfig>): ITranslationConfig {
	return (translateConfig = {...translateConfig, ...config});
}

/**
 * Loads the strings using the provided loader.
 * @param lang
 * @param config
 */
export async function loadStrings (lang: LanguageIdentifier,
                                   config: ITranslationConfig = translateConfig): Promise<Strings> {
	return await translateConfig.loader(lang, config);
}

/**
 * Dispatches a language changed event.
 * @param detail
 */
export function dispatchLangChanged (detail: LangChangedEvent) {
	window.dispatchEvent(new CustomEvent<LangChangedEvent>(TranslateEventKind.LANG_CHANGED, {detail}));
}

/**
 * Updates the configuration object with a new language and strings.
 * Then dispatches that the language has changed.
 * @param newLang
 * @param newStrings
 * @param config
 */
export function updateLang (newLang: LanguageIdentifier,
                            newStrings: Strings,
                            config: ITranslationConfig = translateConfig) {
	dispatchLangChanged({
		previousStrings: config.strings,
		previousLang: config.lang,
		lang: (config.lang = newLang),
		strings: (config.strings = newStrings)
	});
}

/**
 * Listens for changes in the language.
 * Returns a method for unsubscribing from the event.
 * @param callback
 * @param options
 */
export function listenForLangChanged (callback: (e: LangChangedEvent) => void,
                                      options?: EventListenerOptions): (() => void) {
	const handler = (e: CustomEvent<LangChangedEvent>) => callback(e.detail);
	window.addEventListener(TranslateEventKind.LANG_CHANGED, handler, options);
	return () => window.removeEventListener(TranslateEventKind.LANG_CHANGED, handler);
}

/**
 * Sets a new current language and dispatches a global language changed event.
 * @param lang
 * @param config
 */
export async function use (lang: LanguageIdentifier, config: ITranslationConfig = translateConfig) {

	// Load the translations and set the cache
	const strings = await loadStrings(lang, config);
	config.translationCache = {};

	// Dispatch global language changed event while setting the new values
	updateLang(lang, strings, config);
}

/**
 * Interpolates the values into the string.
 * @param text
 * @param values
 */
export function interpolate (text: string, values: Values | ValuesCallback): string {
	return Object.entries(extract(values)).reduce((text, [key, value]) =>
		text.replace(new RegExp(`{{[  ]*${key}[  ]*}}`), String(extract(value))), text);
}

/**
 * Returns a string based on a chain of keys using the dot notation.
 * @param key
 * @param config
 */
export function lookup (key: Key, config: ITranslationConfig = translateConfig): string | null {

	// Split the key in parts (example: hello.world)
	const parts = key.split(".");

	// Find the string by traversing through the strings matching the chain of keys
	let string: Strings | string | null = config.strings || {};
	while (parts.length > 0) {
		string = (<Strings> string)[parts.shift()!];

		// Do not continue if the string is not defined
		if (string == null) return null;
	}

	// Make sure the string is in fact a string!
	return string.toString();
}

/**
 * Translates a key and interpolates if values are defined.
 * Uses the current strings and translation cache to fetch the translation.
 * @param key (eg. "common.get_started")
 * @param values (eg. { count: 42 })
 * @param config
 */
export function get (key: Key,
                     values?: Values | ValuesCallback | null,
                     config: ITranslationConfig = translateConfig): Translation {

	// Either use the translation from the cache or get it and add it to the cache
	let translation = config.translationCache[key]
		|| (config.translationCache[key] = config.lookup(key, config) || config.empty(key, config));

	// Extract the values
	values = values != null ? extract(values) : null;

	// Interpolate the values and return the translation
	return values != null ? translateConfig.interpolate(translation, values, config) : translation;
}

/**
 * Extracts either the value from the function or returns the value that was passed in.
 * @param obj
 */
export function extract<T> (obj: T | (() => T)): T {
	return (typeof obj === "function") ? (<(() => T)>obj)() : obj;
}