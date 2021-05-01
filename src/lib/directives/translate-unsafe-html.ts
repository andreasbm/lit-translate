import { directive } from "lit/directive.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ITranslateConfig, Values, ValuesCallback } from "../model";
import { TranslateDirective } from "./translate";

export class TranslateUnsafeHTMLDirective extends TranslateDirective {
	render (key: string, values?: Values | ValuesCallback, config?: ITranslateConfig) {
		super.render(key, values, config);
		return unsafeHTML(this.getTranslation());
	}

	updateTranslation () {
		const translation = this.getTranslation();
		this.setValue(unsafeHTML(translation));
	}
}

export const translateUnsafeHTML = directive(TranslateUnsafeHTMLDirective);
