## 4. Get the translations

To get a translation use the `get` function. Give this function a string of keys (using the dot notation) that points to the desired translation in the JSON structure. The example below is based on the translations defined in `step 1`.

```typescript
import { get } from "@appnest/lit-translate";

get("header.title"); // "Hello"
get("header.subtitle"); // "World"
```
