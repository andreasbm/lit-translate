import { directive } from "lit/directive.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ITranslateConfig, Key, Values, ValuesCallback } from "../types";
import { TranslateDirective } from "./translate";
import { get } from "../util";

/**
 * A lit directive that updates the translation as HTML when the language changes.
 */
export class TranslateUnsafeHTMLDirective extends TranslateDirective {
    render(key: Key, values?: Values | ValuesCallback, config?: ITranslateConfig) {
        return this.renderValue(() => unsafeHTML(get(key, values, config)));
    }
}

export const translateUnsafeHTML = directive(TranslateUnsafeHTMLDirective);
