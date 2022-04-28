import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, eventOptions, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { registerTranslateConfig, use } from "../../lib";
import styles from "./demo-page.scss";

// Use the typed versions of lit-translate helpers
import { get, translate, translateUnsafeHTML } from "../typed-lit-translate";

const languages = [
    "en",
    "da"
];

// Register loader
registerTranslateConfig({
    loader: lang => fetch(`assets/i18n/${lang}.json`).then(res => res.json())
});

/**
 * Demo page.
 */
@customElement("demo-page-component")
export class DemoPageComponent extends LitElement {

    @property() lang = languages[0];
    @property() thing = "";

    // Defer the first update of the component until the strings has been loaded to avoid empty strings being shown
    @state() hasLoadedStrings = false;

    protected shouldUpdate(props: PropertyValues) {
        return this.hasLoadedStrings && super.shouldUpdate(props);
    }

    // Load the initial language and mark that the strings has been loaded.
    async connectedCallback() {
        super.connectedCallback();

        await use(this.lang);
        this.hasLoadedStrings = true;
    }

    @eventOptions({capture: true})
    private onLanguageSelected(e: Event) {
        this.lang = (e.target as HTMLSelectElement).value;
        use(this.lang).then();
    }

    private async loadDemoComponent() {
        await import("./../components/demo-component")
    }

    protected render(): TemplateResult {
        return html`
            <style>
                ${styles}
            </style>

            <div class="box">
                <h1>lit-translate</h1>
                <p>${translate("app.title")}</p>
                <p>${translate(`app.subtitle`, () => ({thing: this.thing || get("world")}))}</p>
                <p>${translateUnsafeHTML("app.html")}</p>
                <select value="${this.lang}" @change="${this.onLanguageSelected}">
                    ${repeat(languages, lang => html`
                        <option value="${lang}">${lang}</option>
                    `)}
                </select>
                <input placeholder="Your name"
                       @input="${(e: Event) => this.thing = (e.target as HTMLInputElement)!.value}"/>
            </div>
            <div class="box">
                <button @click="${this.loadDemoComponent}">Load components</button>
                <demo-component></demo-component>
                <demo-component></demo-component>
            </div>
            <a href="https://github.com/andreasbm/lit-translate" target="_blank">View on Github</a>
        `;
    }
}
