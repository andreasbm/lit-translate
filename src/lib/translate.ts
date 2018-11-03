import { CachedTranslation, ITranslationConfig, Key, LangChangedEvent, LanguageIdentifier, TranslateEventKind, Translations, Values } from "./model";

/**
 * Default configuration object.
 */
export const defaultTranslateConfig: ITranslationConfig = {
	loader: () => Promise.resolve({}),
	emptyPlaceholder: key => `[${key}]`,
	getTranslation: getTranslation,
	interpolate: interpolate,
	translationCache: new Map<Key, CachedTranslation>(),
	languageCache: new Map<LanguageIdentifier, Translations>(),
	lang: null,
	translations: null
};

// The current configuration for the translation.
let currentConfig: ITranslationConfig = defaultTranslateConfig;

/**
 * Registers a translation config.
 * @param config
 */
export function registerTranslateConfig (config: Partial<ITranslationConfig>): ITranslationConfig {
	return (currentConfig = {...currentConfig, ...config});
}

/**
 * Loads translations using either the values from the cache or the provided translations loader.
 * @param lang
 * @param config
 */
export async function loadTranslations (lang: LanguageIdentifier,
                                        config: ITranslationConfig = currentConfig): Promise<Translations> {
	return config.languageCache.has(lang) ? config.languageCache.get(lang)! : await currentConfig.loader(lang, config);
}

/**
 * Dispatches a language changed event.
 * @param detail
 */
export function dispatchLangChanged (detail: LangChangedEvent) {
	window.dispatchEvent(new CustomEvent<LangChangedEvent>(TranslateEventKind.LANG_CHANGED, {detail}));
}

/**
 * Updates the configuration object with a new language and translations and then dispatches than the language has changed.
 * @param config
 * @param newLang
 * @param newTranslations
 */
export function updateConfig (config: ITranslationConfig, newLang: LanguageIdentifier, newTranslations: Translations) {
	dispatchLangChanged({
		previousTranslations: config.translations,
		previousLang: config.lang,
		lang: (config.lang = newLang),
		translations: (config.translations = newTranslations)
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
export async function use (lang: LanguageIdentifier, config: ITranslationConfig = currentConfig) {

	// Load the translations and set the cache
	const translations = await loadTranslations(lang);
	config.languageCache.set(lang, translations);
	config.translationCache = new Map();

	// Dispatch global language changed event while setting the new values
	updateConfig(config, lang, translations);
}

/**
 * Interpolates the values into the string.
 * @param text
 * @param values
 */
export function interpolate (text: string, values: Values): string {
	return Object.entries(values).reduce((text, [key, value]) =>
		text.replace(new RegExp(`{{[  ]*${key}[  ]*}}`), value), text);
}

/**
 * Returns a translation based on a chain of keys using the dot notation.
 * @param key
 * @param config
 */
export function getTranslation (key: Key, config: ITranslationConfig = currentConfig): string {

	// Split the key in parts (example: hello.world)
	const parts = key.split(".");

	// Find the translation by traversing through the strings matching the chain of keys
	let translation: Translations | string | null = config.translations || {};
	while (parts.length > 0) {
		translation = (<Translations>translation)[parts.shift()!];

		// Do not continue if the translation is not defined
		if (translation == null) return config.emptyPlaceholder(key, config);
	}

	// Make sure the translation is a string!
	return translation.toString();
}

/**
 * Translates a key and interpolates if values are defined.
 * Uses the current strings and string cache to fetch the string.
 * @param key (eg. "common.get_started")
 * @param values (eg. { count: 42 })
 * @param config
 */
export function get (key: Key, values?: Values | null, config: ITranslationConfig = currentConfig) {

	// Check in the cache
	const cached = config.translationCache.get(key);
	if (cached != null && cached.values === values) {
		return cached.translation;
	}

	// Fetch the translation
	let translation = config.getTranslation(key, config);

	// Replace the placeholders
	if (values != null) {
		translation = currentConfig.interpolate(translation, values, config);
	}

	config.translationCache.set(key, {values, translation});
	return translation;
}
