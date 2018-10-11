import { customElement, html, LitElement, property } from "@polymer/lit-element";
import { get, LanguageIdentifier, registerTranslateConfig, translate, use } from "../lib/index";
import { daStrings, enStrings } from "./mock";

const expect = chai.expect;

@customElement("my-component" as any)
class MyComponent extends LitElement {

	@property() things = "";

	get title () {
		return this.shadowRoot.querySelector("h1").innerText;
	}

	get subtitle () {
		return this.shadowRoot.querySelector("p").innerText;
	}

	get awesome () {
		return this.shadowRoot.querySelector("span").innerText;
	}

	render () {
		return html`
			<h1>${translate("header.title")}</h1>
			<p>${translate("header.subtitle")}</p>
			<span>${translate("cta.awesome", {things: this.things})}</span>
		`;
	}
}

describe("translate", () => {

	let $myComponent: MyComponent;

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

		$myComponent = document.createElement("my-component") as MyComponent;
		document.body.appendChild($myComponent);
	});
	after(() => {
		while (document.body.firstChild) {
			(<HTMLElement>document.body.firstChild).remove();
		}
	});

	it("[translate] - should translate and interpolate", async () => {
		$myComponent.things = get("cta.cats");
		await $myComponent.updateComplete;

		expect($myComponent.title).to.equal("Hello");
		expect($myComponent.subtitle).to.equal("World");
		expect($myComponent.awesome).to.equal("Cats are awesome!");
	});

	it("[translate] - should update translations when new strings are set", async () => {
		await use("da");
		$myComponent.things = get("cta.cats");

		await $myComponent.updateComplete;

		expect($myComponent.title).to.equal("Hej");
		expect($myComponent.subtitle).to.equal("Verden");
		expect($myComponent.awesome).to.equal("Katte er for nice!");
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
			emptyPlaceholder: key => `{{ ${key} }}`
		});
		expect(get("this.does.not.exist", null)).to.equal("{{ this.does.not.exist }}");
	});

	it("[get] - should interpolate values correctly", async () => {
		expect(get("cta.awesome", {things: get("cta.cats")})).to.equal("Cats are awesome!");

		await use("da");
		expect(get("cta.awesome", {things: get("cta.cats")})).to.equal("Katte er for nice!");
	});
});
