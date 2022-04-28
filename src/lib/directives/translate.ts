import { directive } from "lit/directive.js";
import { ITranslateConfig, Key, Values, ValuesCallback } from "../types";
import { get } from "../util";
import { LangChangedDirectiveBase } from "./lang-changed-base";

/**
 * A lit directive that updates the translation when the language changes.
 */
export class TranslateDirective extends LangChangedDirectiveBase {
    render<T extends Key>(key: T, values?: Values | ValuesCallback | null, config?: ITranslateConfig): unknown {
        return this.renderValue(() => get(key, values, config));
    }
}

export const translate = directive(TranslateDirective);