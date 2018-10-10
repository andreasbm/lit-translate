import { customElement, html, LitElement, property } from "@polymer/lit-element";
import { addStringsToCache, get, getStringsFromCache, removeStringsFromCache, setStrings, translate } from "../lib/index";
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

	beforeEach(() => {
		addStringsToCache("en", enStrings);
		addStringsToCache("da", daStrings);
		setStrings(getStringsFromCache("en"));

		$myComponent = document.createElement("my-component") as MyComponent;
		document.body.appendChild($myComponent);
	});
	after(() => {
		removeStringsFromCache("en");
		removeStringsFromCache("da");

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
		setStrings(daStrings);
		$myComponent.things = get("cta.cats");

		await $myComponent.updateComplete;

		expect($myComponent.title).to.equal("Hej");
		expect($myComponent.subtitle).to.equal("Verden");
		expect($myComponent.awesome).to.equal("Katte er for nice!");
	});

	it("[get] - should translate keys based on the current language", () => {

		// English
		expect(get("lang")).to.equal("en");
		expect(get("header.title")).to.equal("Hello");
		expect(get("header.subtitle")).to.equal("World");

		// Danish
		setStrings(getStringsFromCache("da"));
		expect(get("lang")).to.equal("da");
		expect(get("header.title")).to.equal("Hej");
		expect(get("header.subtitle")).to.equal("Verden");
	});

	it("[get] - should show empty placeholder if string does not exist", () => {
		expect(get("this.does.not.exist")).to.equal("[this.does.not.exist]");
		expect(get("this.does.not.exist", null, key => `{{ ${key} }}`)).to.equal("{{ this.does.not.exist }}");
	});

	it("[get] - should interpolate values correctly", () => {
		expect(get("cta.awesome", {things: get("cta.cats")})).to.equal("Cats are awesome!");

		setStrings(getStringsFromCache("da"));
		expect(get("cta.awesome", {things: get("cta.cats")})).to.equal("Katte er for nice!");
	});
});
