## 2. Register the translate config

Use the `registerTranslateConfig` function to register a loader that loads translations based on the selected language. In the example below, a loader is registered that uses the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to load a `.json` file for the selected language.

```typescript
import { registerTranslateConfig } from "lit-translate";

registerTranslateConfig({
  loader: lang => fetch(`${lang}.json`).then(res => res.json())
});
```
