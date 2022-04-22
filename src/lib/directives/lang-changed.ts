import {directive} from "lit/directive.js";
import {LangChangedEvent} from "../model";
import {LangChangedDirectiveBase} from "./lang-changed-base";

/**
 * A lit directive that reacts when the language changes and renders the getValue callback.
 */
export class LangChangedDirective extends LangChangedDirectiveBase {
    render(getValue: ((e?: LangChangedEvent) => unknown)): unknown {
        return this.renderValue(getValue);
    }
}

export const langChanged = directive(LangChangedDirective);