import {directive} from "lit/directive.js";
import {ITranslateConfig, Values, ValuesCallback} from "../model";
import {get} from "../util";
import {LangChangedDirectiveBase} from "./lang-changed-base";

/**
 * A lit directive that updates the translation when the language changes.
 */
export class TranslateDirective extends LangChangedDirectiveBase {
    render(key: string, values?: Values | ValuesCallback, config?: ITranslateConfig): unknown {
        return this.renderValue(() => get(key, values, config));
    }
}

export const translate = directive(TranslateDirective);
