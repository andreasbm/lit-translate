## 2. Register the translate config

Use the `registerTranslateConfig` function to register a loader that loads and parses the translations based on a language identifier. In the example below, a loader is registered which loads a `.json` file with translations for a given language.

```typescript
import { registerTranslateConfig } from "@appnest/lit-translate";

registerTranslateConfig({
  loader: lang => fetch(`/assets/i18n/${lang}.json`).then(res => res.json())
});
```
