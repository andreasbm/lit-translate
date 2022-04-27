import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { ITranslateConfig, listenForLangChanged, translate, translateConfig, use } from "../../lib";

import styles from "./demo-component.scss";

/**
 * This component is an example of how strings could be asynchronously be loaded and encapsulated.
 * The trick is to create a new local translate config, in this example "demoTranslateConfig"
 * instead of using the global one from the library "translateConfig". We then make sure to
 * keep the local global config in sync with the global one by providing the "demoTranslateConfig"
 * to the library functions (for example use function and the translate directive)
 */

const demoTranslateConfig: ITranslateConfig = {
    ...translateConfig,
    loader: lang => fetch(`assets/i18n/demo-component.${lang}.json`).then(res => res.json()),
    empty: () => ""
}

// Initially set the demo translate config to the language of the global translate config
if (translateConfig.lang != null) {
    use(translateConfig.lang, demoTranslateConfig).then();
}

// Whenever the language changes also update the language of the demo translate config
listenForLangChanged(async ({lang}) => {
    if (demoTranslateConfig.lang !== lang) {
        await use(lang, demoTranslateConfig);
    }
});

/**
 * Demo page.
 */
@customElement("demo-component")
export class DemoPageComponent extends LitElement {
    protected render(): TemplateResult {
        return html`
            <style>
                ${styles}
            </style>
            <div>
                <h4>${translate("title", undefined, demoTranslateConfig)}</h4>
                <span>${translate("text", undefined, demoTranslateConfig)}</span>
            </div>
        `;
    }
}
