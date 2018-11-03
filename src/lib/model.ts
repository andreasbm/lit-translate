export type Values = object;
export type Key = string;
export type Translations = {[key: string]: string | Translations};
export type CachedTranslation = {values?: Values | null, translation: string};
export type LanguageIdentifier = string;
export type LanguageCache = Map<LanguageIdentifier, Translations>;
export type ValuesCallback = () => Values;

export type TranslationsLoader = (lang: LanguageIdentifier, config: ITranslationConfig) => Promise<Translations>;
export type InterpolateFunction = (text: string, values: Values | null, config: ITranslationConfig) => string;
export type EmptyPlaceholderFunction = (key: Key, config: ITranslationConfig) => string;
export type GetTranslationFunction = (key: Key, config: ITranslationConfig) => string;

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
	translationCache: Map<Key, CachedTranslation>;
	translations: Translations | null;
	lang: LanguageIdentifier | null;
	languageCache: LanguageCache;
}

