import { customElement, eventOptions, html, LitElement, property } from "@polymer/lit-element";
import { TemplateResult } from "lit-html";
import { addStringsToCache, getStrings, setStrings, translate } from "../../lib";

const styles = require("./demo-page.scss").toString();

/**
 * Sets the languag.e
 * @param language
 */
async function setLanguage (language: string) {
	const path = `/assets/i18n/${language}.json`;
	const strings = await getStrings(`/assets/i18n/${language}.json`);
	addStringsToCache(path, strings);
	await setStrings(strings);
}

/**
 * Demo page.
 */
@customElement("demo-page-component" as any)
export class DemoPageComponent extends LitElement {

	@property() lang = "en";

	constructor () {
		super();
		setLanguage(this.lang).then();
	}

	@eventOptions({capture: true})
	private onLanguageChanged (e: Event) {
		this.lang = (<HTMLSelectElement>e.target).value;
		setLanguage(this.lang).then();
	}

	disconnectedCallback () {
		super.disconnectedCallback();
		alert("asd");
	}

	protected render (): TemplateResult {
		return html`
<style>
	${styles}
</style>

<h1>Translation</h1>
<p>${translate("app.lang")}</p>
<p>${translate("app.title")}</p>
<select value="${this.lang}" @change="${this.onLanguageChanged}">
	<option value="en">en</option>
	<option value="da">da</option>
</select>

`;
	}
}
