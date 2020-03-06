import { customElement, eventOptions, html, LitElement, property, PropertyValues } from "lit-element";
import { TemplateResult } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { get, LanguageIdentifier, registerTranslateConfig, translate, use, translateUnsafeHTML } from "../../lib";

import styles from "./demo-page.scss";

const languages = [
	"en",
	"da"
];

// Registers loader
registerTranslateConfig({
	loader: (lang: LanguageIdentifier) => fetch(`assets/i18n/${lang}.json`).then(res => res.json())
});

// const testTranslateConfig: ITranslateConfig = {
// 	...defaultTranslateConfig(),
// 	loader: (lang: LanguageIdentifier) => fetch(`assets/i18n/${lang}.json`).then(res => res.json()),
// };
//
// use("da", testTranslateConfig);

/**
 * Demo page.
 */
@customElement("demo-page-component")
export class DemoPageComponent extends LitElement {

	@property() lang = languages[0];

	// Defer the first update of the component until the strings has been loaded to avoid empty strings being shown
	private hasLoadedStrings = false;

	protected shouldUpdate (changedProperties: PropertyValues) {
		return this.hasLoadedStrings && super.shouldUpdate(changedProperties);
	}

	// Load the initial language and mark that the strings has been loaded.
	async connectedCallback () {
		super.connectedCallback();

		await use(this.lang);
		this.hasLoadedStrings = true;
		this.requestUpdate().then();

		// The below example is how parts of the strings could be lazy loaded
		// listenForLangChanged(() => {
		// 	setTimeout(async () => {
		// 		const subpageStrings = await (await fetch(`./../assets/i18n/subpage-${translateConfig.lang}.json`)
		// 			.then(d => d.json()));
		//
		// 		translateConfig.strings = {...translateConfig.strings, ...subpageStrings};
		// 		translateConfig.translationCache = {};
		//
		// 		this.requestUpdate().then();
		//
		// 		console.log(translateConfig, get("subpage.title"));
		// 	}, 2000);
		// });
	}

	@eventOptions({capture: true})
	private async onLanguageSelected (e: Event) {
		this.lang = (<HTMLSelectElement>e.target).value;
		await use(this.lang).then();
	}

	protected render (): TemplateResult {
		return html`
			<style>
				${styles}
			</style>

			<div id="box">
				<h1>lit-translate</h1>
				<p>${translate("lang")}</p>
				<p>${translate("app.title")}</p>
				<p>${translate("app.subtitle", () => ({thing: get("world")}))}</p>
				<p>${translateUnsafeHTML("app.html")}</p>
				<select value="${this.lang}" @change="${this.onLanguageSelected}">
					${repeat(languages, lang => html`
						<option value="${lang}">${lang}</option>
					`)}
				</select>
			</div>
			<a href="https://github.com/andreasbm/lit-translate" target="_blank">View on Github</a>
		`;
	}
}
