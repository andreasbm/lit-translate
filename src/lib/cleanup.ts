import { NodePart } from "lit-html";

/** #################################################################################
 ** The purpose of this module is to provide an API to clean up the node parts cache.
 ** This is to avoid memory leaks from parts being added and removed to the template.
 ** This is necessary since lit-html currently do not provide a way of cleaning up after a directive.
 ** In the ideal world we would be able to cache the parts in a weakmap, however that makes
 ** us unable to loop over the map which is required for updating the translations when the lang changes.
 ** This module will be obsolete the day lit-html provides a way of cleaning up after a directive
 ** ##################################################################################

/**
 * Check whether the part is still connected / has been removed from the DOM.
 * @param part
 */
export function isPartConnected (part: NodePart): boolean {
	return part.startNode.isConnected;
}

/**
 * Removes the disconnected parts from the cache.
 */
export function removeDisconnectedPartsFromCache (map: Map<NodePart, unknown>) {
	for (const [part] of map) {
		if (!isPartConnected(part)) {
			map.delete(part);
		}
	}
}

/**
 * Starts an interval that cleans up the part cache map each X ms.
 * @param ms
 * @param map
 */
export function attachPartsGarbageCollector (ms: number, map: Map<NodePart, unknown>) {
	setInterval(() => removeDisconnectedPartsFromCache(map), ms);
}
