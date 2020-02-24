## 3. Set the language

Invoke the `use` function to set a language. This function will use the registered loader from [step 1](#-1-define-the-translations) to load the strings for the language and dispatch a global `langChanged` event.

```typescript
import { use } from "lit-translate";

use("en");
```
