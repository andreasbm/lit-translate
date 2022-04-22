import {directive} from "lit/directive.js";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {ITranslateConfig, Values, ValuesCallback} from "../model";
import {TranslateDirective} from "./translate";
import {get} from "../util";

/**
 * A lit directive that updates the translation as HTML when the language changes.
 */
export class TranslateUnsafeHTMLDirective extends TranslateDirective {
    render(key: string, values?: Values | ValuesCallback, config?: ITranslateConfig) {
        return this.renderValue(() => unsafeHTML(get(key, values, config)));
    }
}

export const translateUnsafeHTML = directive(TranslateUnsafeHTMLDirective);
