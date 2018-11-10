export type Value = string;
export type ValueCallback = () => Value;
export type Values = {[key: string]: Value | ValueCallback};
export type ValuesCallback = () => Values;
export type Key = string;
export type LanguageIdentifier = string;
export type Translation = string;
export type Translations = {[key: string]: string | Translations};
export type LanguageCache = { [key: string]: Translations };
export type CachedTranslations = { [key: string]: Translation };

export type TranslationsLoader = (lang: LanguageIdentifier, config: ITranslationConfig) => Promise<Translations>;
export type InterpolateFunction = (text: string, values: Values | ValuesCallback | null, config: ITranslationConfig) => Translation;
export type EmptyPlaceholderFunction = (key: Key, config: ITranslationConfig) => string;
export type GetTranslationFunction = (key: Key, config: ITranslationConfig) => Translation;

export const enum TranslateEventKind {
	LANG_CHANGED = "langChanged"
}

export type LangChangedEvent = {
	previousLang: LanguageIdentifier | null;
	previousTranslations: Translations | null;
	translations: Translations;
	lang: LanguageIdentifier;
};

export interface ITranslationConfig {
	loader: TranslationsLoader;
	interpolate: InterpolateFunction;
	emptyPlaceholder: EmptyPlaceholderFunction;
	getTranslation: GetTranslationFunction;
	translationCache: CachedTranslations;
	translations: Translations | null;
	lang: LanguageIdentifier | null;
	languageCache: LanguageCache;
}

export const CLEANUP_PARTS_MS = 1000 * 60;

