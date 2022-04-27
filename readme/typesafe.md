## Typesafe Translations

<img src="https://raw.githubusercontent.com/andreasbm/lit-translate/master/typesafe.gif" width="300">

If you have a lot of translation keys you can quickly lose the overview of your strings. If this is the case it is recommended to make `lit-translate` typesafe by overwriting the typings from the library. You can do this by for example extending `typings.d.ts` or creating a new typings file (remember to include it in `tsconfig.json`). As as bonus making your translations typesafe will also give you autocompletion. Below is an example of how you could overwrite the default typings.

```typescript
// typings.d.ts
import { ITranslateConfig, Translation, Values, ValuesCallback } from "lit-translate";

// TODO: Fill in the translation keys below
declare type TranslationKey = "header.title" | "header.subtitle" | "cta.awesome" | "cta.cats" | "footer.html";

declare module "lit-translate" {
    export function get(key: TranslationKey, values?: Values | ValuesCallback | null, config?: ITranslateConfig): Translation;
    export const translate: (key: TranslationKey, values?: Values | ValuesCallback | undefined, config?: ITranslateConfig | undefined) => import("lit-html/directive").DirectiveResult<typeof TranslateDirective>;
    export const translateUnsafeHTML: (key: TranslationKey, values?: Values | ValuesCallback | undefined, config?: ITranslateConfig | undefined) => import("lit-html/directive").DirectiveResult<typeof TranslateUnsafeHTMLDirective>;
}
```
