export type Value = object | string | number;
export type ValueCallback = () => Value;
export type Values = {[key: string]: Value | ValueCallback};
export type ValuesCallback = () => Values;
export type Key = string;
export type LanguageIdentifier = string;
export type Translation = string;
export type Strings = {[key: string]: string | Strings};
export type TranslationCache = {[key: string]: Translation};

export type StringsLoader = (lang: LanguageIdentifier, config: ITranslateConfig) => Promise<Strings>;
export type InterpolateFunction = (text: string,
                                   values: Values | ValuesCallback | null,
                                   config: ITranslateConfig) => Translation;
export type EmptyFunction = (key: Key, config: ITranslateConfig) => string;
export type LookupFunction = (key: Key, config: ITranslateConfig) => string | null;

export const enum TranslateEventKind {
	LANG_CHANGED = "langChanged"
}

export type LangChangedEvent = {
	previousLang?: LanguageIdentifier;
	previousStrings?: Strings;
	strings: Strings;
	lang: LanguageIdentifier;
};

export interface ITranslateConfig {
	loader: StringsLoader;
	interpolate: InterpolateFunction;
	empty: EmptyFunction;
	lookup: LookupFunction;
	lang?: LanguageIdentifier;
	strings?: Strings;
	translationCache: TranslationCache;
}

export const CLEANUP_PARTS_MS = 1000 * 4;
export type LangChangedDirectiveCallback = ((e?: LangChangedEvent) => any);

