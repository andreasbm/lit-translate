## 3. Set the language

Invoke the `use` function to set a language. This function will use the registered loader from step 1 to load the strings for the language and dispatch a global `langChanged` event.

```typescript
import { use } from "@appnest/lit-translate";

use("en");
```
