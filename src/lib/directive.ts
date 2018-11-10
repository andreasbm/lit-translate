import { directive, NodePart } from "lit-html";
import { attachPartsGarbageCollector, isPartConnected } from "./directive-cache";
import { CLEANUP_PARTS_MS, LangChangedEvent, Values, ValuesCallback } from "./model";
import { get, listenForLangChanged } from "./translate";

// Caches the parts and the translations.
// In the ideal world this would be a weakmap, but it is not possible to loop over weakmaps.
// This is the best solution until lit-html provides an API to clean up after directives.
const partCache = new Map<NodePart, {key: string, values?: Values | ValuesCallback, listen: boolean}>();

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
attachPartsGarbageCollector(CLEANUP_PARTS_MS, partCache);


/**
 * Handles the translation.
 * @param part
 * @param key
 * @param values
 */
function handleTranslation (part: NodePart, key: string, values?: Values | ValuesCallback | null) {

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
export const translate = directive((key: string,
                                    values?: Values | ValuesCallback,
                                    listen = true) => (part: NodePart) => {
	partCache.set(part, {key, values, listen});
	handleTranslation(part, key, values);
});
