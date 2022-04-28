import { ITranslateConfig, Values, ValuesCallback } from "./types";
import { translateConfig } from "./config";
import { get } from "./util";
import { translate } from "./directives/translate";
import { translateUnsafeHTML } from "./directives/translate-unsafe-html";

/**
 * A factory function that wraps get, translate and translateUnsafeHTML to make the keys typesafe.
 */
export function typedKeysFactory<Keys extends Record<string, unknown>>() {
    return {
        get<T extends ObjectLookupString<Keys>>(key: T, values?: Values | ValuesCallback | null, config: ITranslateConfig = translateConfig) {
            return get(key, values, config);
        },
        translate<T extends ObjectLookupString<Keys>>(key: T, values?: Values | ValuesCallback | null, config?: ITranslateConfig) {
            return translate(key, values, config);
        },
        translateUnsafeHTML<T extends ObjectLookupString<Keys>>(key: T, values?: Values | ValuesCallback | null, config?: ITranslateConfig) {
            return translateUnsafeHTML(key, values, config);
        }
    }
}


// Use this type to extend lit-translate with typed keys
export type ObjectLookupString<T, MaxDepth extends number = 10, Separator extends string = "."> = ObjectLookupStringHelper<T, ``, MaxDepth, 0, Separator>;

type SimpleValue = string | number | bigint | boolean | symbol | RegExp | Date | null | undefined;
type IgnoredLookupValue =
    SimpleValue
    | CallableFunction
    | Set<unknown>
    | WeakSet<never>
    | Map<unknown, unknown>
    | WeakMap<never, unknown>;

type MaybeSuffixWithSeparator<T extends string, Separator extends string = "."> = T extends `` ? T : `${T}${Separator}`;

// Type that turns flattens the keys of an object into strings
type ObjectLookupStringHelper<T, Acc extends string, MaxDepth extends number, CurrentDepth extends number = 0, Separator extends string = "."> = {
    [Key in keyof T]: Key extends string
        ? CurrentDepth extends MaxDepth
            ? `${MaybeSuffixWithSeparator<Acc, Separator>}${Key}`
            : T[Key] extends IgnoredLookupValue
                ? `${MaybeSuffixWithSeparator<Acc, Separator>}${Key}`
                : T[Key] extends (infer El)[] | readonly (infer El)[]
                    ? `${MaybeSuffixWithSeparator<Acc, Separator>}${Key}${Separator}${number}` | El extends IgnoredLookupValue
                        ? `${MaybeSuffixWithSeparator<Acc, Separator>}${Key}${Separator}${number}`
                        : ObjectLookupStringHelper<El, `${MaybeSuffixWithSeparator<Acc, Separator>}${Key}${Separator}${number}`, MaxDepth, Next<CurrentDepth>>
                    :
                    | `${MaybeSuffixWithSeparator<Acc, Separator>}${Key}`
                    | ObjectLookupStringHelper<NonNullable<T[Key]>, `${MaybeSuffixWithSeparator<Acc, Separator>}${Key}`, MaxDepth, Next<CurrentDepth>>
        : never;
}[keyof T];

// A type used for recursive iterations
export type Next<T extends number> = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101
][T];
