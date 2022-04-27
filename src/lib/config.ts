import { ITranslateConfig } from "./types";
import { interpolate, lookup } from "./helpers";

/**
 * Default configuration object.
 */
export const defaultTranslateConfig: (() => ITranslateConfig) = () => {
    return {
        loader: () => Promise.resolve({}),
        empty: key => `[${key}]`,
        lookup: lookup,
        interpolate: interpolate,
        translationCache: {}
    };
};

// The current configuration.
export let translateConfig: ITranslateConfig = defaultTranslateConfig();

/**
 * Registers a translation config by merging it into the existing one.
 * The registered translation config can be accessed through the singleton called translateConfig.
 * @param config
 */
export function registerTranslateConfig(config: Partial<ITranslateConfig>): ITranslateConfig {
    return (translateConfig = {
        ...translateConfig,
        ...config
    });
}
