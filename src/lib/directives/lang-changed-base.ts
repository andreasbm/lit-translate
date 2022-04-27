import { AsyncDirective } from "lit/async-directive.js";
import { LangChangedSubscription } from "../types";
import { listenForLangChanged } from "../util";

/**
 * An abstract lit directive that reacts when the language changes.
 */
export abstract class LangChangedDirectiveBase extends AsyncDirective {
    protected langChangedSubscription: LangChangedSubscription | null = null;
    protected getValue: (() => unknown) = (() => "");

    /**
     * Sets up the directive by setting the getValue property and subscribing.
     * When subclassing LangChangedDirectiveBase this function should be call in the render function.
     * @param getValue
     */
    renderValue(getValue: (() => unknown)): unknown {
        this.getValue = getValue;
        this.subscribe();
        return this.getValue();
    }

    /**
     * Called when the lang changed event is dispatched.
     */
    updateValue() {
        this.setValue(this.getValue());
    }

    /**
     * Subscribes to the lang changed event.
     */
    subscribe() {
        if (this.langChangedSubscription == null) {
            this.langChangedSubscription = listenForLangChanged(this.updateValue.bind(this));
        }
    }

    /**
     * Unsubscribes from the lang changed event.
     */
    unsubscribe() {
        if (this.langChangedSubscription != null) {
            this.langChangedSubscription();
        }
    }

    /**
     * Unsubscribes when disconnected.
     */
    disconnected() {
        this.unsubscribe();
    }

    /**
     * Subscribes when reconnected.
     */
    reconnected() {
        this.subscribe();
    }
}