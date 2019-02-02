import { customElement, html, LitElement, property } from "lit-element";
import { repeat } from "lit-html/directives/repeat";
import { removeDisconnectedParts } from "../lib/cleanup";
import { partCache } from "../lib/directive";
import { registerTranslateConfig, translate, use } from "../lib/index";

const expect = chai.expect;

@customElement("cleanup-component" as any)
class CleanupComponent extends LitElement {

	@property({type: Array}) items: number[] = [];

	render () {
		return html`
			${repeat(this.items, item => html`<p>${translate("key", {item})}</p>`)};
		`;
	}
}

describe("cleanup", () => {

	let $cleanupComponent: CleanupComponent;

	beforeEach(async () => {
		registerTranslateConfig({
			loader: () => Promise.resolve({
				key: "Item {{ item }}"
			})
		});

		await use("en");

		$cleanupComponent = new CleanupComponent();
		document.body.appendChild($cleanupComponent);
	});
	after(() => {
		while (document.body.firstChild) {
			(<HTMLElement>document.body.firstChild).remove();
		}
	});

	it("[cleanup] - should remove disconnected parts to avoid memory leaks", async () => {
		$cleanupComponent.items = [1, 2, 3, 4, 5];
		await $cleanupComponent.updateComplete;

		expect(partCache.size).to.equal(5);

		$cleanupComponent.items = [1];
		await $cleanupComponent.updateComplete;

		removeDisconnectedParts(partCache);

		expect(partCache.size).to.equal(1);
	});
});
