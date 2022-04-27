## 4. Get the translations

Get translations with the `get` function. Give this function a string of keys (separated with `.`) that points to the desired translation in the JSON structure. The example below is based on the translations defined in [step 1](#-1-define-the-translations) and registered in [step 2](#-2-register-the-translate-config).

```typescript
import { get } from "lit-translate";

get("header.title"); // "Hello"
get("header.subtitle"); // "World"
```
