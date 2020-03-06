import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { langChanged } from "../directive";
import { ITranslateConfig, Values, ValuesCallback } from "../model";
import { get } from "../util";

/**
 * A lit directive that updates the translation and renders embedded HTML markup when the language changes.
 * @param key
 * @param values
 * @param config
 */
export const translateUnsafeHTML = (key: string,
                                    values?: Values | ValuesCallback,
                                    config?: ITranslateConfig) => langChanged(() => unsafeHTML(get(key, values, config)));
