import { customElement, eventOptions, html, LitElement, property } from "@polymer/lit-element";
import { TemplateResult } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { get, LanguageIdentifier, registerTranslateConfig, translate, use } from "../../lib";

import styles from "./demo-page.scss";

const languages = [
	"en",
	"da"
];

// Registers loader
registerTranslateConfig({
	loader: (lang: LanguageIdentifier) => fetch(`assets/i18n/${lang}.json`).then(res => res.json())
});

/**
 * Demo page.
 */
@customElement("demo-page-component" as any)
export class DemoPageComponent extends LitElement {

	@property() lang = languages[0];

	// Defer the first update of the component until the strings has been loaded to avoid empty strings being shown
	private hasLoadedStrings = false;

	protected shouldUpdate () {
		return this.hasLoadedStrings;
	}

	// Load the initial language and mark that the strings has been loaded.
	async connectedCallback () {
		await use(this.lang);
		this.hasLoadedStrings = true;
		super.connectedCallback();
	}

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

<div id="box">
	<h1>@appnest/lit-translate</h1>
	<p>${translate("lang")}</p>
	<p>${translate("app.title")}</p>
	<p>${translate("app.subtitle", {thing: () => get("world")})}</p>
	<select value="${this.lang}" @change="${this.onLanguageChanged}">
		${repeat(languages, lang => html`
			<option value="${lang}">${lang}</option>
		`)}
	</select>
</div>
<a href="https://github.com/andreasbm/lit-translate" target="_blank">View on Github</a>
`;
	}
}
