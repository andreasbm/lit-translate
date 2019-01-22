import { ITranslateConfig, Key, Strings, Values, ValuesCallback } from "./model";

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
export function lookup (key: Key, config: ITranslateConfig): string | null {

	// Split the key in parts (example: hello.world)
	const parts = key.split(".");

	// Find the string by traversing through the strings matching the chain of keys
	let string: Strings | string | null = config.strings;

	// Do not continue if the string is not defined or if we have traversed all of the key parts
	while (string != null && parts.length > 0) {
		string = (<Strings>string)[parts.shift()!];
	}

	// Make sure the string is in fact a string!
	return string != null ? string.toString() : null;
}

/**
 * Extracts either the value from the function or returns the value that was passed in.
 * @param obj
 */
export function extract<T> (obj: T | (() => T)): T {
	return (typeof obj === "function") ? (<(() => T)>obj)() : obj;
}
