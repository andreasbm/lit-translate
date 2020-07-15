## 3. Set the language

Invoke the `use` function to set a language. This function will use the registered loader from [step 2](#-2-register-the-translate-config) to load the strings for the language and dispatch a global `langChanged` event.

```js
import { use } from "lit-translate";

use("en");
```
