import { langChanged } from "../directive";
import { ITranslateConfig, Values, ValuesCallback } from "../model";
import { get } from "../util";

/**
 * A lit directive that updates the translation when the language changes.
 * @param key
 * @param values
 * @param config
 */
export const translate = (key: string,
                          values?: Values | ValuesCallback,
                          config?: ITranslateConfig) => langChanged(() => get(key, values, config));
