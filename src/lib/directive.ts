import { Directive, directive, NodePart } from "lit-html";
import { LangChangedEvent, Values, ValuesCallback } from "./model";
import { get, listenForLangChanged } from "./translate";

// Caches the parts and the translations.
// In the ideal world this would be a weakmap, but it is not possible to loop over weakmaps.
const partCache = new Map<NodePart, {key: string, values?: Values | ValuesCallback, listen: boolean}>();

/**
 * Check whether the element is still connected / has been removed from the DOM.
 * @param part
 */
export function isPartConnected (part: NodePart) {
	return ((<HTMLElement>part.options.eventContext).isConnected);
}

/**
 * Listens for changes in the language and updates all of the cached parts if necessary
 */
function attachTranslateListener () {
	listenForLangChanged((e: LangChangedEvent) => {
		for (const [part, {key, values, listen}] of partCache) {
			if (listen && isPartConnected(part)) {
				handleTranslation(part, key, values);
				part.commit();
			}
		}
	});
}

attachTranslateListener();

/**
 * Handles the translation.
 * @param part
 * @param key
 * @param values
 */
function handleTranslation (part: NodePart, key: string, values?: Values | ValuesCallback) {

	// Grab the values
	values = (typeof values === "function") ? (<ValuesCallback>values)() : values;

	// Translate the key and interpolate the values
	const translation = get(key, values);

	// Only set the value if the cache has changed
	if (part.value === translation) {
		return;
	}

	// Set the value of the new translation
	part.setValue(translation);
}


/**
 * Directive that makes translations more efficient.
 * @param key
 * @param values
 * @param listen
 */
export const translate =
	(key: string, values?: Values | ValuesCallback, listen = true): Directive<NodePart> =>
		directive((part: NodePart) => {
			partCache.set(part, {key, values, listen});
			handleTranslation(part, key, values);
		});
