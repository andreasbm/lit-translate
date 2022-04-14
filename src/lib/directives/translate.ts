import { AsyncDirective } from "lit/async-directive.js";
import { directive } from "lit/directive.js";
import { ITranslateConfig, LangChangedSubscription, Translation, Values, ValuesCallback } from "../model";
import { get, listenForLangChanged } from "../util";

/**
 * A lit directive that updates the translation when the language changes.
 */
export class TranslateDirective extends AsyncDirective {
	protected langChangedSubscription: LangChangedSubscription | null = null;
	protected getTranslation: (() => Translation) = (() => "");

	render (key: string, values?: Values | ValuesCallback, config?: ITranslateConfig): unknown {
		this.getTranslation = () => get(key, values, config);
		this.subscribe();
		return this.getTranslation();
	}

	updateTranslation () {
		const translation = this.getTranslation();
		this.setValue(translation);
	}

	subscribe () {
		if (this.langChangedSubscription == null) {
			this.langChangedSubscription = listenForLangChanged(this.updateTranslation.bind(this));
		}
	}

	unsubscribe () {
		if (this.langChangedSubscription != null) {
			this.langChangedSubscription();
		}
	}

	disconnected () {
		this.unsubscribe();
	}

	reconnected () {
		this.subscribe();
	}
}

// Create the directive function
export const translate = directive(TranslateDirective);
