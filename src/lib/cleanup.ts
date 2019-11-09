import { NodePart, AttributePart, BooleanAttributePart, EventPart, PropertyPart } from "lit-html";

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
export function isConnected (part: NodePart | AttributePart | BooleanAttributePart | EventPart | PropertyPart): boolean {
	if (part instanceof NodePart) {
		return part.startNode.isConnected;

	} else if (part instanceof AttributePart) {
		return part.committer.element.isConnected;

	} else {
		return part.element.isConnected;
	}
}

/**
 * Removes the disconnected parts from the cache.
 */
export function removeDisconnectedParts (map: Map<NodePart, unknown>) {
	for (const [part] of map) {
		if (!isConnected(part)) {
			map.delete(part);
		}
	}
}

/**
 * Invokes a callback when the browser is idle.
 * Fallback to setTimeout.
 * @param cb
 */
export function whenIdle (cb: (() => void)) {
	"requestIdleCallback" in window ? (window as any).requestIdleCallback(cb) : setTimeout(cb)
}

/**
 * Starts an interval that cleans up the part cache map each X ms.
 * @param map
 * @param ms
 */
export function attachPartsGarbageCollector (map: Map<NodePart, unknown>, ms: number) {
	setInterval(() => whenIdle(() => removeDisconnectedParts(map)), ms);
}
