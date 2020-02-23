import { customElement, html, LitElement, property } from "lit-element";
import { repeat } from "lit-html/directives/repeat";
import { get, LanguageIdentifier, registerTranslateConfig, translate, use } from "../lib/index";
import { daStrings, enStrings } from "./mock";

const expect = chai.expect;

@customElement("translated-component" as any)
class TranslatedComponent extends LitElement {

	@property() things = "";

	get title () {
		return this.shadowRoot!.querySelector("h1")!.innerText;
	}

	get subtitle () {
		return this.shadowRoot!.querySelector("p")!.innerText;
	}

	get awesome () {
		return this.shadowRoot!.querySelector("span")!.innerText;
	}

	render () {
		return html`
			<h1>${translate("header.title")}</h1>
			<p>${translate("header.subtitle")}</p>
			<span>${translate("cta.awesome", () => {
			return {things: this.things};
		})}</span>
		`;
	}
}

@customElement("stress-component" as any)
class StressComponent extends LitElement {
	render () {
		return html`
			${repeat(Array(10000), () => html`<p>${translate("header.title")}</p>`)}
		`;
	}
}

describe("translate", () => {

	let $translatedComponent: TranslatedComponent;

	beforeEach(async () => {
		registerTranslateConfig({
			loader: (lang: LanguageIdentifier) => {
				switch (lang) {
					case "en":
						return Promise.resolve(enStrings);
					case "da":
						return Promise.resolve(daStrings);
				}

				throw new Error(`Language '${lang}' not valid.`);
			}
		});

		await use("en");

		$translatedComponent = new TranslatedComponent();
		document.body.appendChild($translatedComponent);
	});
	after(() => {
		while (document.body.firstChild) {
			(<HTMLElement>document.body.firstChild).remove();
		}
	});

	it("[translate] - should translate and interpolate", async () => {
		$translatedComponent.things = get("cta.cats");
		await $translatedComponent.updateComplete;

		expect($translatedComponent.title).to.equal("Hello");
		expect($translatedComponent.subtitle).to.equal("World");
		expect($translatedComponent.awesome).to.equal("Cats are awesome!");
	});

	it("[translate] - should update translations when new strings are set", async () => {
		await use("da");
		$translatedComponent.things = get("cta.cats");

		await $translatedComponent.updateComplete;

		expect($translatedComponent.title).to.equal("Hej");
		expect($translatedComponent.subtitle).to.equal("Verden");
		expect($translatedComponent.awesome).to.equal("Katte er for nice!");
	});

	it("[get] - should translate keys based on the current language", async () => {

		// English
		expect(get("lang")).to.equal("en");
		expect(get("header.title")).to.equal("Hello");
		expect(get("header.subtitle")).to.equal("World");

		// Danish
		await use("da");
		expect(get("lang")).to.equal("da");
		expect(get("header.title")).to.equal("Hej");
		expect(get("header.subtitle")).to.equal("Verden");
	});

	it("[get] - should show empty placeholder if string does not exist", () => {
		expect(get("this.does.not.exist")).to.equal("[this.does.not.exist]");
	});

	it("[get] - should overwrite empty placeholder if one is defined", () => {
		registerTranslateConfig({
			empty: key => `{{ ${key} }}`
		});
		expect(get("this.does.not.exist", null)).to.equal("{{ this.does.not.exist }}");
	});

	it("[get] - should interpolate values correctly", async () => {
		expect(get("cta.awesome", {things: get("cta.cats")})).to.equal("Cats are awesome!");

		await use("da");
		expect(get("cta.awesome", {things: get("cta.cats")})).to.equal("Katte er for nice!");
	});

	it("[get] - should interpolate values correctly with same placeholder used multiple times", async () => {
		const email = "test@test.com";
		expect(get("footer.contact", {email})).to.equal(`Contact us on ${email}. It was ${email}!`);

		await use("da");
		expect(get("footer.contact", {email})).to.equal(`Kontakt os på ${email}. Det var ${email}!`);
	});

	it("[translate] - should be performant", async () => {

		// Create the stress component
		const $stressComponent = document.createElement("stress-component") as StressComponent;
		document.body.appendChild($stressComponent);

		// Measure the time it takes to update all of the strings
		window.performance.mark("stress_start");
		await use("da").then();
		await $stressComponent.updateComplete;
		window.performance.mark("stress_end");

		// Compute the measurement
		window.performance.measure("stress", "stress_start", "stress_end");
		const durationMs = window.performance.getEntriesByName("stress")[0].duration;

		// The 500 mark was set based on performance testing in Chrome
		expect(durationMs).to.be.lessThan(500);
	});
});
