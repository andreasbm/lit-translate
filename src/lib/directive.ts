import { directive, NodePart, Part } from "lit-html";
import { attachPartsGarbageCollector, isConnected } from "./cleanup";
import { CLEANUP_PARTS_MS, LangChangedDirectiveCallback, LangChangedEvent, Values, ValuesCallback } from "./model";
import { get, listenForLangChanged } from "./translate";

// Caches the parts and the translations.
// In the ideal world this would be a weakmap, but it is not possible to loop over weakmaps.
// This is the best solution until lit-html provides an API to clean up after directives.
export const partCache = new Map<NodePart, LangChangedDirectiveCallback>();

/**
 * Listens for changes in the language and updates all of the cached parts if necessary
 */
function attachTranslateListener () {
	listenForLangChanged((e: LangChangedEvent) => {
		for (const [part, cb] of partCache) {
			if (isConnected(part)) {
				updatePart(part, cb, e);
			}
		}
	});
}

attachTranslateListener();
attachPartsGarbageCollector(partCache, CLEANUP_PARTS_MS);

/**
 * Handles the translation.
 * @param part
 * @param cb
 * @param e
 */
function updatePart (part: Part, cb: LangChangedDirectiveCallback, e?: LangChangedEvent) {

	// Grab the new value
	const newValue = cb(e);

	// Only set the value if it has changed
	if (part.value === newValue) {
		return;
	}

	// Set the new value
	part.setValue(newValue);
	part.commit();
}

/**
 * A lit directive that invokes the callback when the language changes.
 * @param key
 * @param values
 * @param listen
 */
export const langChanged = directive((cb: LangChangedDirectiveCallback) => (part: NodePart) => {
	partCache.set(part, cb);
	updatePart(part, cb);
});

/**
 * A lit directive that updates the translation when the language changes.
 * @param key
 * @param values
 */
export const translate = (key: string, values?: Values | ValuesCallback) => langChanged(() => get(key, values));