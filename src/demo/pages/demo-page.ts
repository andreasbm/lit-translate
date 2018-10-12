import { customElement, eventOptions, html, LitElement, property } from "@polymer/lit-element";
import { TemplateResult } from "lit-html";
import { get, LanguageIdentifier, registerTranslateConfig, translate, use } from "../../lib";

const styles = require("./demo-page.scss").toString();

// Registers loader
registerTranslateConfig({
	loader: (lang: LanguageIdentifier) => fetch(`/assets/i18n/${lang}.json`).then(res => res.json())
});

// Set default language
use("en").then();

/**
 * Demo page.
 */
@customElement("demo-page-component" as any)
export class DemoPageComponent extends LitElement {

	@property() lang = "en";

	@eventOptions({capture: true})
	private onLanguageChanged (e: Event) {
		this.lang = (<HTMLSelectElement>e.target).value;
		use(this.lang).then();
	}

	protected render (): TemplateResult {
		return html`
<style>
	${styles}
</style>

<h1>Translation</h1>
<p>${translate("lang")}</p>
<p>${translate("app.title")}</p>
<p>${translate("app.subtitle", () => {
			return {thing: get("world")};
		})}</p>
<select value="${this.lang}" @change="${this.onLanguageChanged}">
	<option value="en">en</option>
	<option value="da">da</option>
</select>

`;
	}
}
