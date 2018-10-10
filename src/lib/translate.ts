export type Values = object;
export type Translations = {[key: string]: string | Translations};
export type CachedTranslation = {values: Values, translation: string};
export type LanguageIdentifier = string;
export type TranslationsLoader = (lang: LanguageIdentifier) => Promise<Translations>;

export enum TranslateEventKind {
	LANG_CHANGED = "langChanged"
}

export type LangChangedEvent = {
	previousLang: LanguageIdentifier | null;
	previousTranslations: Translations | null;
	translations: Translations;
	lang: LanguageIdentifier;
};

// Cache mapping a language identifier to a translations object.
const languageCache = new Map<LanguageIdentifier, Translations>();

// Loads that loads translations for a given language
let translationsLoader: TranslationsLoader | null = null;

// Objects for the current language
let currentTranslationCache: {[key: string]: CachedTranslation} = {};
let currentTranslations: Translations | null = null;
let currentLang: LanguageIdentifier | null = null;

/**
 * Registers a loader that loads the translations for a given language.
 * @param loader
 */
export function registerLoader (loader: TranslationsLoader) {
	translationsLoader = loader;
}

/**
 * Removes the cache of translations for a language.
 */
export function removeCache (lang: LanguageIdentifier) {
	languageCache.delete(lang);
}

/**
 * Loads translations using either the values from the cache or the provided translations loader.
 * @param lang
 */
export async function loadTranslations (lang: LanguageIdentifier): Promise<Translations> {
	if (languageCache.has(lang)) {
		return languageCache.get(lang);
	}

	return await translationsLoader(lang);
}

/**
 * Sets a new current language and dispatches a global language changed event.
 * @param lang
 */
export async function use (lang: LanguageIdentifier) {

	// Load the translations and set the cache
	const translations = await loadTranslations(lang);
	languageCache.set(lang, translations);
	currentTranslationCache = {};

	// Store the previous objects for the event
	const previousTranslations = currentTranslations;
	const previousLang = currentLang;

	// Set the new objects
	currentTranslations = translations;
	currentLang = lang;

	// Dispatch global language changed event
	window.dispatchEvent(new CustomEvent<LangChangedEvent>(TranslateEventKind.LANG_CHANGED, {
		detail: {
			previousTranslations,
			previousLang,
			lang,
			translations
		}
	}));
}

/**
 * Interpolates the values into the string.
 * @param text
 * @param values
 */
export function interpolate (text: string, values: Values): string {
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
	const cached = currentTranslationCache[key];
	if (cached != null && cached.values === values) {
		return cached.translation;
	}

	// Split the key in parts (example: hello.world)
	const parts = key.split(".");

	// Find the translation by traversing through the strings matching the chain of keys
	let translation: string | object = currentTranslations || {};
	while (parts.length > 0) {
		translation = translation[parts.shift()];

		// Do not continue if the translation is not defined
		if (translation == null) return emptyPlaceholder(key);
	}

	// Make sure the translation is a string!
	translation = translation.toString();

	// Replace the placeholders
	if (values != null) {
		translation = interpolate(translation, values);
	}

	currentTranslationCache[key] = {values, translation};
	return translation;
}