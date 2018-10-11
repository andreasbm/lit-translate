export type Values = object;
export type Translations = {[key: string]: string | Translations};
export type CachedTranslation = {values: Values, translation: string};
export type LanguageIdentifier = string;
export type TranslationsLoader = (lang: LanguageIdentifier) => Promise<Translations>;
export type LanguageCache = Map<LanguageIdentifier, Translations>;
export type ValuesCallback = () => Values;

export type InterpolateFunction = (text: string, values: Values) => string;
export type EmptyPlaceholderFunction = (key: string) => string;
export type FetchTranslationFunction = (key: string, values: Values | null, config: ITranslationConfig) => string;

export enum TranslateEventKind {
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
	fetchTranslation: FetchTranslationFunction;
	translationCache: Map<string, CachedTranslation>;
	translations: Translations | null;
	lang: LanguageIdentifier | null;
	languageCache: LanguageCache;
}

